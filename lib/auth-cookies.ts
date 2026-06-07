import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ONE_DAY_SECONDS = 24 * 60 * 60;

export function getAuthCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: ONE_DAY_SECONDS,
  };
}

export function extractJwtFromSetCookie(
  setCookieHeaders: string[],
): string | undefined {
  for (const header of setCookieHeaders) {
    const match = header.match(/(?:^|,\s*)jwt=([^;,]+)/);
    if (match?.[1] && match[1] !== "logout") return match[1];
  }
  return undefined;
}

export function getSetCookieHeaders(res: Response): string[] {
  if (typeof res.headers.getSetCookie === "function") {
    return res.headers.getSetCookie();
  }

  const header = res.headers.get("set-cookie");
  return header ? [header] : [];
}

export function setJwtCookie(response: NextResponse, token: string) {
  response.cookies.set("jwt", token, getAuthCookieOptions());
}

export function clearJwtCookie(response: NextResponse) {
  response.cookies.set("jwt", "", {
    ...getAuthCookieOptions(),
    maxAge: 0,
  });
}

export async function getJwtFromRequest(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;
  return token && token !== "logout" ? token : undefined;
}
