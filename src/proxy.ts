import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Izinkan akses langsung tanpa redirect untuk aset publik statis dan file media
  const isPublicAsset =
    pathname.startsWith("/images") ||
    pathname.startsWith("/api") ||
    /\.(png|jpg|jpeg|svg|webp|ico|css|js)$/i.test(pathname);

  if (isPublicAsset) {
    return NextResponse.next();
  }

  const hasAuthCookie = request.cookies.has("simgizi-auth");
  const isLoginPage = pathname.startsWith("/login");

  // Jika belum login dan mengakses halaman privat -> redirect ke /login
  if (!hasAuthCookie && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika sudah login dan mengakses /login -> redirect ke dashboard (/)
  if (hasAuthCookie && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)",
  ],
};
