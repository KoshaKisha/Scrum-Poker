// app/api/rooms/[roomId]/vote/route.ts
import { prisma } from "@/lib/prisma"
import { getUserOrThrow } from "@/lib/server/auth/auth-server"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { roomId: string } }) {
  try {
    const user = await getUserOrThrow()
    const { vote } = await req.json()

    const existing = await prisma.vote.findFirst({
      where: { roomId: params.roomId, userId: user.id },
    })

    if (existing) {
      await prisma.vote.update({
        where: { id: existing.id },
        data: { value: vote },
      })
    } else {
      await prisma.vote.create({
        data: { roomId: params.roomId, userId: user.id, value: vote },
      })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 })
  }
}
