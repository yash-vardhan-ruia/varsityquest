import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CollegeType, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { createCollegeSchema } from "@/lib/validations/college";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const q = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const type = searchParams.get("type") || undefined;
    const state = searchParams.get("state") || undefined;
    
    const minFeesStr = searchParams.get("minFees");
    const maxFeesStr = searchParams.get("maxFees");
    const minRatingStr = searchParams.get("minRating");
    
    const minFees = minFeesStr ? parseInt(minFeesStr, 10) : undefined;
    const maxFees = maxFeesStr ? parseInt(maxFeesStr, 10) : undefined;
    const minRating = minRatingStr ? parseFloat(minRatingStr) : undefined;

    const sortBy = searchParams.get("sortBy") || "rating";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "12", 10));
    const skip = (page - 1) * limit;

    const where: Prisma.CollegeWhereInput = {};

    // Search term matching name, city, state, or specific location
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { state: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
      ];
    }

    // Category filter (Engineering, Medical, Commerce, etc.)
    if (category && category !== "All") {
      where.category = { equals: category, mode: "insensitive" };
    }

    // College type filter (GOVERNMENT, PRIVATE, DEEMED)
    if (type && type !== "All") {
      where.type = type as CollegeType;
    }

    // State filter (e.g. Maharashtra, Tamil Nadu)
    if (state && state !== "All") {
      where.state = { equals: state, mode: "insensitive" };
    }

    // Total fees range filtering
    if (minFees !== undefined || maxFees !== undefined) {
      where.totalFees = {};
      if (minFees !== undefined) where.totalFees.gte = minFees;
      if (maxFees !== undefined) where.totalFees.lte = maxFees;
    }

    // Minimum rating filter (0 to 5)
    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    // Sorting parameters
    let orderBy: Prisma.CollegeOrderByWithRelationInput = {};
    if (sortBy === "name") {
      orderBy = { name: sortOrder };
    } else if (sortBy === "fees") {
      orderBy = { totalFees: sortOrder };
    } else if (sortBy === "rating") {
      orderBy = { rating: sortOrder };
    } else if (sortBy === "placements") {
      orderBy = { placements: { avgPackage: sortOrder } };
    } else {
      orderBy = { rating: "desc" };
    }

    // DB Query: Retrieve colleges and total count sequentially to prevent pool contention
    const colleges = await prisma.college.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        placements: true,
        courses: true,
        reviews: true,
      },
    });
    const total = await prisma.college.count({ where });

    return NextResponse.json({
      success: true,
      data: colleges,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("GET /api/colleges error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while fetching colleges" },
      { status: 500 }
    );
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function randomSuffix(): string {
  return Math.random().toString(36).substring(2, 6);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = createCollegeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { courses, placement, ...collegeData } = parsed.data;

    // Generate slug and ensure uniqueness
    let slug = generateSlug(collegeData.name);
    const existing = await prisma.college.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${randomSuffix()}`;
    }

    const college = await prisma.college.create({
      data: {
        ...collegeData,
        slug,
        ...(courses && courses.length > 0
          ? { courses: { createMany: { data: courses } } }
          : {}),
        ...(placement ? { placements: { create: placement } } : {}),
      },
      include: {
        courses: true,
        placements: true,
      },
    });

    return NextResponse.json(
      { success: true, data: college },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/colleges error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while creating the college",
      },
      { status: 500 }
    );
  }
}
