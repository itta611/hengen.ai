import { getSessionCookie } from "better-auth/cookies"
import { type NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  const isLoggedIn = Boolean(
    getSessionCookie(request, { cookiePrefix: "mutar" })
  )

  if (request.nextUrl.pathname === "/") {
    return isLoggedIn
      ? NextResponse.redirect(new URL("/home", request.url))
      : NextResponse.next()
  }


  if (request.nextUrl.pathname === "/terms" || request.nextUrl.pathname === "/privacy" || request.nextUrl.pathname === "/specified") {
    return NextResponse.next()
  }

  return isLoggedIn
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/", request.url))
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
}
