import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "./actions/auth";
import {
  getCourseIdFromLecturePath,
  isUserEnrolledInCourse,
} from "./lib/enrollment";

function redirectHome(req: NextRequest) {
  return NextResponse.redirect(new URL("/", req.url));
}

function isValidToken(token: string | undefined): token is string {
  return Boolean(token && token !== "logout");
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!isValidToken(token)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const data = await getCurrentUser();
    if (data?.role !== "admin") {
      return redirectHome(req);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/my-courses")) {
    if (!isValidToken(token)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const data = await getCurrentUser();
    if (data?.role !== "user") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/profile" || pathname.startsWith("/profile/")) {
    if (!isValidToken(token)) {
      return redirectHome(req);
    }
    const user = await getCurrentUser();
    if (!user) {
      return redirectHome(req);
    }
    return NextResponse.next();
  }

  const courseId = getCourseIdFromLecturePath(pathname);
  if (courseId) {
    if (!isValidToken(token)) {
      return redirectHome(req);
    }
    const enrolled = await isUserEnrolledInCourse(courseId, token);
    if (!enrolled) {
      return redirectHome(req);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}
