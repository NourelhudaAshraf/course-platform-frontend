import {
  extractJwtFromSetCookie,
  getSetCookieHeaders,
  setJwtCookie,
} from "@/lib/auth-cookies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await res.json();
  const response = NextResponse.json(data, { status: res.status });

  if (!res.ok) return response;

  const token =
    extractJwtFromSetCookie(getSetCookieHeaders(res)) ?? data?.data?.token;

  if (token) setJwtCookie(response, token);

  return response;
}
