"use server";
import { getToken } from "@/lib/helpers";
import { ProfileFormData } from "@/lib/schemas/profile";
import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
  requiresAuth,
} from "@/lib/actionResult";
import { UserProps } from "@/lib/types";
import axios from "axios";

export async function getCurrentUser(): Promise<UserProps | null> {
  try {
    const headers = await getToken();
    if (!("headers" in headers)) {
      return null;
    }
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`,
      {
        ...headers,
      },
    );
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
  const headers = await getToken();
  if (!("headers" in headers)) return requiresAuth();

  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/update-me`,
      data,
      {
        ...headers,
      },
    );
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
