import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserOrThrow } from "@/lib/server/auth/auth-server"
import { v4 as uuid } from "uuid"
import fs from "fs"
import path from "path"
import { writeFile, mkdir } from "fs/promises"



export async function PATCH(req: Request) {
  try {
    const user = await getUserOrThrow()
    const formData = await req.formData()

    const name = formData.get("name")?.toString() || ""
    const file = formData.get("avatar") as File | null

    let avatarUrl: string | undefined

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const fileExt = file.name.split(".").pop()
      const fileName = `${uuid()}.${fileExt}`
      const filePath = path.join(process.cwd(), "public/uploads", fileName)
      const uploadDir = path.join(process.cwd(), "public/uploads")
        if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
        }
      await writeFile(filePath, buffer)
      avatarUrl = `/uploads/${fileName}`
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        ...(avatarUrl ? { avatarUrl } : {}),
      },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
