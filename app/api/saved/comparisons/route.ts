import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/saved/comparisons - Retrieve saved comparisons for the current user
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

    const savedComparisons = await prisma.savedComparison.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Resolve the college details (e.g. names and categories) for each comparison so the dashboard can render chips instantly
    const resolvedComparisons = await Promise.all(
      savedComparisons.map(async (comparison) => {
        const colleges = await prisma.college.findMany({
          where: {
            id: { in: comparison.collegeIds },
          },
          select: {
            id: true,
            name: true,
            city: true,
            imageUrl: true,
          },
        });

        return {
          ...comparison,
          colleges,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: resolvedComparisons,
    });
  } catch (error: unknown) {
    console.error("GET /api/saved/comparisons error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while fetching saved comparisons" },
      { status: 500 }
    );
  }
}

// POST /api/saved/comparisons - Save a comparison group (2-3 colleges)
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
    const { collegeIds, label } = body;

    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length < 2 || collegeIds.length > 4) {
      return NextResponse.json(
        { success: false, error: "collegeIds must be an array containing 2 to 4 valid college IDs" },
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

    // Verify all colleges actually exist
    const collegesCount = await prisma.college.count({
      where: {
        id: { in: collegeIds },
      },
    });

    if (collegesCount !== collegeIds.length) {
      return NextResponse.json(
        { success: false, error: "One or more of the specified college IDs do not exist" },
        { status: 404 }
      );
    }

    // Save comparison
    const newComparison = await prisma.savedComparison.create({
      data: {
        userId,
        collegeIds,
        label: label || `Comparison of ${collegeIds.length} Colleges`,
      },
    });

    return NextResponse.json(
      { success: true, data: newComparison },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/saved/comparisons error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while saving the comparison" },
      { status: 500 }
    );
  }
}

// DELETE /api/saved/comparisons - Delete a saved comparison by ID
export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Comparison ID is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Check if comparison exists and belongs to the user
    const existing = await prisma.savedComparison.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Comparison not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the saved comparison
    await prisma.savedComparison.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Comparison deleted successfully",
    });
  } catch (error: unknown) {
    console.error("DELETE /api/saved/comparisons error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while deleting the comparison" },
      { status: 500 }
    );
  }
}
