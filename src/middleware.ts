import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();

  // Protect all /[tenantSlug] routes
  // Assume generic logic: if the path has more than 1 segment and doesn't match public routes,
  // we treat it as a tenant route that needs protection.

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

  // Get Auth Context
  const secret = process.env.AUTH_SECRET;
  const token = await getToken({ req, secret });

  if (!token) {
    // If user is trying to access a private route and is NOT logged in, redirect to login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If we have a token, we could potentially verify if `token.tenantSlug` matches
  // the current slug they are hitting, but NextAuth.js JWT returns the primary tenant.
  // For basic protection, just knowing they are logged in is a step forward.
  // The backend database queries will enforce tenant-level isolation anyway.

  // Basic check: if hitting /app without a specific tenant slug (assuming they didn't manually type one),
  // we could theoretically redirect to `/${token.tenantSlug}/home`.
  if (pathname === "/app") {
     url.pathname = `/${token.tenantSlug}/home`;
     return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Config to specify which paths this middleware applies to
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
