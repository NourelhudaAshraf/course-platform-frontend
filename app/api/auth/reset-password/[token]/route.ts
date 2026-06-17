import {
  extractJwtFromSetCookie,
  getSetCookieHeaders,
  setJwtCookie,
} from "@/lib/auth-cookies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const body = await req.json();
  console.log(body);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reset-password/${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await res.json();
  const response = NextResponse.json(data, { status: res.status });

  if (!res.ok) return response;

  const jwt =
    extractJwtFromSetCookie(getSetCookieHeaders(res)) ?? data?.data?.token;

  if (jwt) setJwtCookie(response, jwt);

  return response;
}
