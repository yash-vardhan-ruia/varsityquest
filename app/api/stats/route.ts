import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalColleges = await prisma.college.count();
    
    const categories = await prisma.college.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    
    const states = await prisma.college.findMany({
      select: { state: true },
      distinct: ['state'],
    });

    return NextResponse.json({
      success: true,
      data: {
        colleges: totalColleges,
        streams: categories.length,
        states: states.length,
      }
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
