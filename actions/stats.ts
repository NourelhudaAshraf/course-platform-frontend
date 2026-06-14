"use server";
import { api, isAuthenticated } from "@/lib/api";
import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
  requiresAuth,
} from "@/lib/actionResult";
import { StatsProps, UserProps } from "@/lib/types";

export async function getStatistics(): Promise<ActionResult<StatsProps>> {
  if (!(await isAuthenticated())) return requiresAuth();

  try {
    const res = await api.get("/api/v1/statistics/");
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to fetch statistics data");
    }
    return ok(res.data.data);
  } catch (e) {
    console.log(e);
    return fail(getAxiosErrorMessage(e, "Failed to fetch statistics data"));
  }
}

export async function getLatestUsers(): Promise<ActionResult<UserProps[]>> {
  if (!(await isAuthenticated())) return requiresAuth();

  try {
    const res = await api.get("/api/v1/users/latest-users");
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to fetch latest users data");
    }
    return ok(res.data.data);
  } catch (e) {
    console.log(e);
    return fail(getAxiosErrorMessage(e, "Failed to fetch latest users data"));
  }
}
