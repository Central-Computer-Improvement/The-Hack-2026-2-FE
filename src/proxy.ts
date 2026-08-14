import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hasAuthCookie = request.cookies.has("simgizi-auth");
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  // If the user does not have the auth cookie and is NOT trying to access the login page
  if (!hasAuthCookie && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the user has the auth cookie and is trying to access the login page
  if (hasAuthCookie && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
