// app/api/rooms/[roomId]/reset/route.ts
import { prisma } from "@/lib/prisma"
import { getUserOrThrow } from "@/lib/server/auth/auth-server"
import { NextResponse } from "next/server"

export async function POST(_: Request, context: { params: { roomId: string } }) {
  try {
    const params = await context.params
    const user = await getUserOrThrow()
    const room = await prisma.room.findUnique({ where: { id: params.roomId } })

    if (!room) throw new Error("Room not found")
    if (room.createdById !== user.id) throw new Error("Only creator can reset votes")

    await prisma.vote.deleteMany({ where: { roomId: params.roomId } })
    await prisma.room.update({
      where: { id: params.roomId },
      data: { isRevealed: false },
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 })
  }
}
