import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "./actions/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt")?.value;

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const data = await getCurrentUser();
    if (data?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }
  if (req.nextUrl.pathname.startsWith("/my-courses")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const data = await getCurrentUser();
    if (data?.role !== "user") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }
  return NextResponse.next();
}
