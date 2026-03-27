import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();

  // Bypass logic for public static paths and auth routes
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Auth is provided by the wrapper
  const isAuthenticated = !!req.auth;

  if (!isAuthenticated) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const token = req.auth?.user as any;

  if (pathname === "/app") {
     const slug = token?.tenantSlug || "app";
     url.pathname = `/${slug}/home`;
     return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
