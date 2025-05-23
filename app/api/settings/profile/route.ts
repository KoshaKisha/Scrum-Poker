import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserOrThrow } from "@/lib/server/auth/auth-server"

export async function PATCH(req: Request) {
  try {
    const user = await getUserOrThrow()
    const formData = await req.formData()

    const name = formData.get("name")?.toString() || ""

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
      },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
