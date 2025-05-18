import { NextResponse } from "next/server"
import { registerOnServer } from "@/lib/server/auth/auth-server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const user = await registerOnServer(body)
    return NextResponse.json(user)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}