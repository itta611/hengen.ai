import { getSessionCookie } from "better-auth/cookies"
import { type NextRequest, NextResponse } from "next/server"

const publicPaths = new Set([
  "/privacy",
  "/terms",
  "/specified",
  "/en/privacy",
  "/en/terms",
])

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isLoggedIn = Boolean(
    getSessionCookie(request, { cookiePrefix: "mutar" })
  )
  const requestHeaders = new Headers(request.headers)

  if (pathname.startsWith("/en/")) {
    requestHeaders.set("x-mutar-locale", "en")
  }

  if (pathname === "/") {
    return isLoggedIn
      ? NextResponse.redirect(new URL("/home", request.url))
      : NextResponse.next({ request: { headers: requestHeaders } })
  }

  if (publicPaths.has(pathname) || isLoggedIn) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  return NextResponse.redirect(new URL("/", request.url))
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
}
