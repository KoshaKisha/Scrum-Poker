import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJwt } from "@/lib/server/jwt"

// Маршруты, которые требуют аутентификации
const protectedRoutes = ["/dashboard", "/rooms", "/settings", "/admin"]

// Маршруты, которые должны перенаправлять на dashboard если пользователь уже залогинен
const authRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  // Проверяем валидность токена
  const payload = token ? await verifyJwt(token) : null
  const isAuthenticated = !!payload

  // Если пользователь пытается зайти на страницы логина/регистрации, но уже залогинен
  if (authRoutes.some((route) => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Если пользователь пытается зайти на защищенные страницы без аутентификации
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    // Сохраняем URL, на который пользователь хотел попасть
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Для админ панели дополнительно проверяем роль
  if (pathname.startsWith("/admin") && isAuthenticated) {
    try {
      const userRole = (payload as any)?.role
      if (userRole !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
