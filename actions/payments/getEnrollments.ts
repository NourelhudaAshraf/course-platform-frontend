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

export async function getEnrollments(page = 1): Promise<ActionResult<any>> {
  const headers = await getToken();
  if (!("headers" in headers)) return requiresAuth();

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: LIMIT.toString(),
    });
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment?${params.toString()}`,
      { ...headers },
    );
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to fetch enrollments");
    }
    return ok(res.data);
  } catch (error) {
    console.log(error);
    return fail(getAxiosErrorMessage(error, "Failed to fetch enrollments"));
  }
}
