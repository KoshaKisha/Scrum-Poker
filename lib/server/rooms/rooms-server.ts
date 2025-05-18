import { prisma } from "@/lib/prisma"
import { getUserOrThrow } from "@/lib/server/auth/auth-server"

export async function getUserRoomsServer() {
  const user = await getUserOrThrow()

  const rooms = await prisma.room.findMany({
    where: { createdById: user.id },
    include: { participants: true },
  })

  return rooms
}

export async function joinRoom(roomId: string) {
  const user = await getUserOrThrow()

  const existing = await prisma.participant.findFirst({
    where: { roomId, userId: user.id },
  })

  if (!existing) {
    await prisma.participant.create({
      data: {
        roomId,
        userId: user.id,
      },
    })
  }
}

export async function submitVote(roomId: string, vote: string) {
  const user = await getUserOrThrow()

  const existing = await prisma.vote.findFirst({
    where: { roomId, userId: user.id },
  })

  if (existing) {
    await prisma.vote.update({
      where: { id: existing.id },
      data: { value: vote },
    })
  } else {
    await prisma.vote.create({
      data: { roomId, userId: user.id, value: vote } 
    })
  }
}

export async function revealVotes(roomId: string) {
  const user = await getUserOrThrow()
  const room = await prisma.room.findUnique({ where: { id: roomId } })
  if (!room) throw new Error("Room not found")
  if (room.createdById !== user.id) throw new Error("Only creator can reveal votes")

  await prisma.room.update({
    where: { id: roomId },
    data: { isRevealed: true },
  })
}

export async function resetVotes(roomId: string) {
  const user = await getUserOrThrow()
  const room = await prisma.room.findUnique({ where: { id: roomId } })
  if (!room) throw new Error("Room not found")
  if (room.createdById !== user.id) throw new Error("Only creator can reset votes")

  await prisma.vote.deleteMany({ where: { roomId } })
  await prisma.room.update({
    where: { id: roomId },
    data: { isRevealed: false },
  })
}

