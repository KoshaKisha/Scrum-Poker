import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/server/jwt"
import { prisma } from "@/lib/prisma"

// export async function GET() {
//   const token = (await cookies()).get("token")?.value

//   if (!token) return NextResponse.json({ user: null }, { status: 401 })

//   const payload = verifyJwt(token)
//   if (!payload || typeof payload === "string") {
//     return NextResponse.json({ user: null }, { status: 401 })
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: payload.id },
//     select: { id: true, email: true, name: true },
//   })

//   return NextResponse.json({ user })
// }

export async function GET() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("token")?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const payload = verifyJwt(token)
  if (!payload || typeof payload !== "object" || !("id" in payload)) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(payload.id) },
    select: { id: true, email: true, name: true, role: true },
  })

  return NextResponse.json({ user })
}

