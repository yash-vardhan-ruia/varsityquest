import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/saved/colleges - Retrieve all colleges saved by the current user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          include: {
            placements: true,
            courses: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Map to return just the college objects directly for frontend convenience
    const collegesList = savedColleges.map((sc) => sc.college);

    return NextResponse.json({
      success: true,
      data: collegesList,
    });
  } catch (error: unknown) {
    console.error("GET /api/saved/colleges error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while fetching saved colleges" },
      { status: 500 }
    );
  }
}

// POST /api/saved/colleges - Save a college for the current user
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { collegeId } = body;

    if (!collegeId) {
      return NextResponse.json(
        { success: false, error: "collegeId is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Verify user exists in database to prevent foreign key errors from stale session cookies
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json(
        { success: false, error: "Session stale due to a database reset. Please log out and sign in again." },
        { status: 401 }
      );
    }

    // Check if the college exists
    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!collegeExists) {
      return NextResponse.json(
        { success: false, error: "College not found" },
        { status: 404 }
      );
    }

    // Upsert or find unique saved record to avoid duplicate errors
    const savedRecord = await prisma.savedCollege.upsert({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
      update: {},
      create: {
        userId,
        collegeId,
      },
    });

    return NextResponse.json(
      { success: true, data: savedRecord },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/saved/colleges error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while saving the college" },
      { status: 500 }
    );
  }
}
