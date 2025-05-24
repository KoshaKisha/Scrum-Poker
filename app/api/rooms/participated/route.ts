import { NextResponse } from "next/server"
import { getParticipatedRooms } from "@/lib/server/rooms/rooms-server"

export async function GET() {
  try {
    const rooms = await getParticipatedRooms()
    return NextResponse.json(rooms)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 })
  }
}
