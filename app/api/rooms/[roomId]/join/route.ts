// app/api/rooms/[roomId]/join/route.ts
import { prisma } from "@/lib/prisma"
import { getUserOrThrow } from "@/lib/server/auth/auth-server"
import { NextResponse } from "next/server"

export async function POST(_: Request, context: { params: { roomId: string } }) {
  try {
    const params = await context.params
    const user = await getUserOrThrow()

    const existing = await prisma.participant.findFirst({
      where: { roomId: params.roomId, userId: user.id },
    })

    if (!existing) {
      await prisma.participant.create({
        data: {
          roomId: params.roomId,
          userId: user.id,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 })
  }
}
