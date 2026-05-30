import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ collegeId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const { collegeId } = resolvedParams;

    if (!collegeId) {
      return NextResponse.json(
        { success: false, error: "College ID is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Check if bookmark exists
    const bookmark = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    if (!bookmark) {
      return NextResponse.json(
        { success: false, error: "Saved college record not found" },
        { status: 404 }
      );
    }

    // Delete it
    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "College removed from saved list successfully",
    });
  } catch (error: unknown) {
    console.error("DELETE /api/saved/colleges/[collegeId] error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while unsaving the college" },
      { status: 500 }
    );
  }
}
