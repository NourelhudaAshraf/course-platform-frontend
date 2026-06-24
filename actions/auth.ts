"use server";
import { api, isAuthenticated } from "@/lib/api";
import {
  extractJwtFromSetCookie,
  getJwtFromRequest,
  getSetCookieHeaders,
  setJwtInCookieStore,
} from "@/lib/auth-cookies";
import { ChangePasswordFormData } from "@/lib/schemas/changePassword";
import { ProfileFormData } from "@/lib/schemas/profile";
import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
  requiresAuth,
} from "@/lib/actionResult";
import { UserProps } from "@/lib/types";

export async function getCurrentUser(): Promise<UserProps | null> {
  try {
    if (!(await isAuthenticated())) {
      return null;
    }
    const res = await api.get("/api/v1/auth/me");
    if (res.status !== 200) return null;
    const { data: user } = await res.data;
    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function updateCurrentUserData(
  data: ProfileFormData,
): Promise<ActionResult<UserProps>> {
  if (!(await isAuthenticated())) return requiresAuth();

  try {
    const res = await api.patch("/api/v1/users/update-me", data);
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to update profile");
    }
    const { data: user } = await res.data;
    return ok(user);
  } catch (e) {
    console.log(e);
    return fail(getAxiosErrorMessage(e, "Failed to update profile"));
  }
}

export async function updatePassword(
  data: Pick<ChangePasswordFormData, "currentPassword" | "newPassword">,
): Promise<ActionResult> {
  const token = await getJwtFromRequest();
  if (!token) return requiresAuth();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/update-password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `jwt=${token}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      },
    );

    const body = await res.json();

    if (!res.ok) {
      return fail(body.message || "Failed to update password");
    }

    const jwt =
      extractJwtFromSetCookie(getSetCookieHeaders(res)) ?? body?.data?.token;

    if (jwt) await setJwtInCookieStore(jwt);

    return ok(undefined);
  } catch (e) {
    console.log(e);
    return fail(getAxiosErrorMessage(e, "Failed to update password"));
  }
}
