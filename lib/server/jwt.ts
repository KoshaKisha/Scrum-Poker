import jwt from "jsonwebtoken"
import { jwtVerify, SignJWT } from "jose"

// const JWT_SECRET = process.env.JWT_SECRET || "dev-secret"
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret")

// export function signJwt(payload: object) {
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
// }

// export function verifyJwt(token: string) {
//   try {
//     return jwt.verify(token, JWT_SECRET)
//   } catch {
//     return null
//   }
// }
export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    return null
  }
}

export async function signJwt(payload: any) {
  return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(JWT_SECRET)
}
