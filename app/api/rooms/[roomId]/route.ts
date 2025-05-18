import { prisma } from "@/lib/prisma"
import { getUserOrThrow } from "@/lib/server/auth/auth-server"
import { NextResponse } from "next/server"

// Mark as dynamic
export const dynamic = "force-dynamic"

export async function GET(request: Request, context: { params: { roomId: string } }) {
  try {
    // Await the params object before accessing its properties
    const params = await context.params

    const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId

    await getUserOrThrow()

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        participants: { include: { user: true } },
        votes: true,
      },
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 })
  }
}

export async function DELETE(_: Request, context: { params: { roomId: string } }) {
  try {
    const params = await context.params
    const roomId = params.roomId
    
    const user = await getUserOrThrow()

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    })

    if (!room || room.createdById !== user.id) {
      return NextResponse.json({ error: "Room not found or unauthorized" }, { status: 403 })
    }

    // First delete all votes associated with the room
    await prisma.vote.deleteMany({
      where: { roomId },
    })

    // Then delete all participants
    await prisma.participant.deleteMany({
      where: { roomId },
    })

    // Finally delete the room itself
    await prisma.room.delete({
      where: { id: roomId },
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Error deleting room:", e)
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}