import { cookies } from "next/headers";

export async function getToken() {
  const cookie = await cookies();
  const token = cookie.get("jwt")?.value;
  const headers =
    token && token !== "logout"
      ? {
          headers: {
            Cookie: `jwt=${token}`,
          },
        }
      : {};
  return headers;
}
