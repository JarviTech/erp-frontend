import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl.pathname;

  // Public routes
  if (url.startsWith("/login") ) {
    return NextResponse.next();
  }

  // Verify token
  const user = verifyToken(token);
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based protection
  if (url.startsWith("/dashboard/admin") && user.role !== "1") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Add user info to request headers for use in routes/pages
  const res = NextResponse.next();
  res.headers.set("x-user-role", user.role);
  res.headers.set("x-user-name", user.username);
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"], // protected routes
};
