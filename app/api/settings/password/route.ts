import { NextResponse } from "next/server"
import { hash, compare } from "bcrypt"
import { getUserOrThrow } from "@/lib/server/auth/auth-server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json()
    const user = await getUserOrThrow()

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!dbUser || !dbUser.password_hash) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isMatch = await compare(currentPassword, dbUser.password_hash)

    if (!isMatch) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    const hashedNewPassword = await hash(newPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash: hashedNewPassword },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
