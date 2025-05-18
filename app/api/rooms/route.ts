import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/server/jwt"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getUserRoomsServer } from "@/lib/server/rooms/rooms-server"

export async function POST(req: Request) {
  const token = (await cookies()).get("token")?.value
  const payload = verifyJwt(token || "")
  if (!payload || typeof payload !== "object" || !("id" in payload)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, description } = await req.json()

  const newRoom = await prisma.room.create({
    data: {
      name,
      description,
      votingSystem: "fibonacci",
      createdById: Number(payload.id),
      participants: {
        create: { userId: Number(payload.id) },
      },
    },
  })

  return NextResponse.json(newRoom)
}

export async function GET() {
  try {
    const rooms = await getUserRoomsServer()
    return NextResponse.json(rooms)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 })
  }
}