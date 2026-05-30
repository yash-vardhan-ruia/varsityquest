import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        { success: false, error: "Colleges IDs parameter 'ids' is required" },
        { status: 400 }
      );
    }

    // Split and clean ids
    const collegeIds = idsParam
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    if (collegeIds.length < 1) {
      return NextResponse.json(
        { success: false, error: "At least one valid college ID must be provided" },
        { status: 400 }
      );
    }

    if (collegeIds.length > 3) {
      return NextResponse.json(
        { success: false, error: "You can compare a maximum of 3 colleges at a time" },
        { status: 400 }
      );
    }

    const colleges = await prisma.college.findMany({
      where: {
        id: { in: collegeIds },
      },
      include: {
        placements: true,
        courses: true,
        reviews: true,
      },
    });

    // Sort matching order of input ids
    const sortedColleges = collegeIds
      .map((id) => colleges.find((c) => c.id === id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    return NextResponse.json({
      success: true,
      data: sortedColleges,
    });
  } catch (error: unknown) {
    console.error("GET /api/colleges/compare error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during comparison fetch" },
      { status: 500 }
    );
  }
}
