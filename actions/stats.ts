"use server";
import { getToken } from "@/lib/helpers";
import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
  requiresAuth,
} from "@/lib/actionResult";
import { StatsProps, UserProps } from "@/lib/types";
import axios from "axios";

export async function getStatistics(): Promise<ActionResult<StatsProps>> {
  const headers = await getToken();
  if (!("headers" in headers)) return requiresAuth();

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/statistics/`,
      { ...headers },
    );
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
  const headers = await getToken();
  if (!("headers" in headers)) return requiresAuth();

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/latest-users`,
      { ...headers },
    );
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to fetch latest users data");
    }
    return ok(res.data.data);
  } catch (e) {
    console.log(e);
    return fail(getAxiosErrorMessage(e, "Failed to fetch latest users data"));
  }
}
