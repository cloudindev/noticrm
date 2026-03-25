import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
  const isPublicRoute = nextUrl.pathname === "/" || isAuthRoute || nextUrl.pathname.startsWith("/forgot-password");

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && isAuthRoute) {
    // If logged in and trying to access login, redirect to their tenant
    const tenantSlug = (req.auth?.user as any)?.tenantId || "workspace"; // Fallback
    // Note: Since tenantId isn't slug, in a real app we'd fetch the slug, but for now we route to /app
    // Or we use the first tenant slug. We can just use the tenantId as the slug for now.
    return NextResponse.redirect(new URL(`/${tenantSlug}/home`, nextUrl));
  }

  return NextResponse.next();
});
