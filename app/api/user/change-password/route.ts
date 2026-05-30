import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { changePasswordSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = changePasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = result.data;

    // Fetch user details from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Google OAuth registered users might not have a password set yet
    const hasPassword = !!user.passwordHash;

    if (hasPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to change to a new password" },
          { status: 400 }
        );
      }

      // Check current password correctness
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash!);
      if (!isValid) {
        return NextResponse.json(
          { error: "Incorrect current password" },
          { status: 400 }
        );
      }
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Save hashed password in user record
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return NextResponse.json({
      success: true,
      message: hasPassword
        ? "Password changed successfully."
        : "Password set successfully! You can now log in with either your email or Google.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "An error occurred while changing your password." },
      { status: 500 }
    );
  }
}
