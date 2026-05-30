import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params to handle both synchronous and asynchronous params resolution in Next 14/15/16
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }

    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        courses: {
          orderBy: { fees: "asc" },
        },
        placements: true,
        reviews: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!college) {
      return NextResponse.json(
        { success: false, error: "College not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: college,
    });
  } catch (error: unknown) {
    console.error("GET /api/colleges/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while fetching college details" },
      { status: 500 }
    );
  }
}
