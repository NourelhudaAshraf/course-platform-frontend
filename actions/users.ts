"use server";
import { api, isAuthenticated } from "@/lib/api";
import { LIMIT } from "@/lib/constants";
import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
  requiresAuth,
} from "@/lib/actionResult";

export async function getAllUsers(page: number): Promise<ActionResult<any>> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", LIMIT.toString());

  if (!(await isAuthenticated())) return requiresAuth();

  try {
    const res = await api.get(`/api/v1/users?${params.toString()}`);
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
  if (!(await isAuthenticated())) return requiresAuth();

  try {
    const res = await api.delete(`/api/v1/users/${id}`);
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
  if (!(await isAuthenticated())) return requiresAuth();

  try {
    const res = await api.patch(`/api/v1/users/promote/${id}`, {});
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to promote user");
    }
    return ok(undefined);
  } catch (e) {
    console.log(e);
    return fail(getAxiosErrorMessage(e, "Something went wrong"));
  }
}
