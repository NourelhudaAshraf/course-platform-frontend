import { clearJwtCookie, getJwtFromRequest } from "@/lib/auth-cookies";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getJwtFromRequest();

  if (token) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
      headers: { Cookie: `jwt=${token}` },
    });
  }

  const response = NextResponse.json({ status: "success" });
  clearJwtCookie(response);
  return response;
}
