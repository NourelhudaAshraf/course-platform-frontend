"use server";

import { LIMIT } from "@/lib/constants";
import { api, isAuthenticated } from "@/lib/api";
import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
  requiresAuth,
} from "@/lib/actionResult";

export async function getEnrollments(page = 1): Promise<ActionResult<any>> {
  if (!(await isAuthenticated())) return requiresAuth();

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: LIMIT.toString(),
    });
    const res = await api.get(`/api/v1/enrollment?${params.toString()}`);
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to fetch enrollments");
    }
    return ok(res.data);
  } catch (error) {
    console.log(error);
    return fail(getAxiosErrorMessage(error, "Failed to fetch enrollments"));
  }
}
