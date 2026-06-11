"use server";
import { LIMIT } from "@/lib/constants";
import { getToken } from "@/lib/helpers";
import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
  requiresAuth,
} from "@/lib/actionResult";
import axios from "axios";

export async function getAllUsers(page: number): Promise<ActionResult<any>> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", LIMIT.toString());

  const headers = await getToken();
  if (!("headers" in headers)) return requiresAuth();

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users?${params.toString()}`,
      {
        ...headers,
      },
    );
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to fetch users data");
    }
    return ok(res.data);
  } catch (e) {
    console.log(e);
    return fail(getAxiosErrorMessage(e, "Failed to fetch users data"));
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const headers = await getToken();
  if (!("headers" in headers)) return requiresAuth();

  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${id}`,
      {
        ...headers,
      },
    );
    if (res.status !== 204) {
      return fail(res.data.message || "Failed to delete user");
    }
    return ok(undefined);
  } catch (e) {
    console.log(e);
    return fail(getAxiosErrorMessage(e, "Failed to delete user"));
  }
}

export async function promoteUser(id: string): Promise<ActionResult> {
  const headers = await getToken();
  if (!("headers" in headers)) return requiresAuth();

  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/promote/${id}`,
      {},
      {
        ...headers,
      },
    );
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to promote user");
    }
    return ok(undefined);
  } catch (e) {
    console.log(e);
    return fail(getAxiosErrorMessage(e, "Something went wrong"));
  }
}
