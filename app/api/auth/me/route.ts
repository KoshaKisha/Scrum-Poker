import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/server/jwt"
import { prisma } from "@/lib/prisma"
import { getUserOrThrow } from "@/lib/server/auth/auth-server"

export async function GET() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("token")?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const payload = await verifyJwt(token)
  if (!payload || typeof payload !== "object" || !("id" in payload)) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(payload.id) },
    select: { id: true, email: true, name: true, role: true },
  })

  return NextResponse.json({ user })
}

