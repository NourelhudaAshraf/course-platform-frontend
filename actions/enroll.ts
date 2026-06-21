/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { api, isAuthenticated } from "@/lib/api";
import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
  requiresAuth,
} from "@/lib/actionResult";

type CheckoutSession = {
  url: string;
};

export default async function enrollFromAPI(
  id: string,
): Promise<ActionResult<CheckoutSession>> {
  if (!(await isAuthenticated())) return requiresAuth();

  try {
    const res = await api.get(`/api/v1/enrollment/checkout-session/${id}`);
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to pay");
    }
    return ok(res.data.data);
  } catch (e: any) {
    console.log(e.response?.data?.message);
    return fail(getAxiosErrorMessage(e, "Failed to pay"));
  }
}

export async function getEnrolledCourses(): Promise<ActionResult<any>> {
  if (!(await isAuthenticated())) return requiresAuth();

  try {
    const res = await api.get("/api/v1/enrollment/my-courses/");
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to get enrolled courses");
    }
    return ok(res.data);
  } catch (e: any) {
    console.log(e.response?.data?.message);
    return fail(getAxiosErrorMessage(e, "Failed to get enrolled courses"));
  }
}

export async function checkIsCourseEnrolled(
  id: string,
): Promise<ActionResult<boolean>> {
  if (!(await isAuthenticated())) return ok(false);

  try {
    const res = await api.get(`/api/v1/enrollment/${id}`);
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to check enrollment");
    }
    return ok(Boolean(res.data.data));
  } catch (e) {
    console.log(e);
    return fail(getAxiosErrorMessage(e, "Something went wrong"));
  }
}
