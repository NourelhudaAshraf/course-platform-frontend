/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getToken } from "@/lib/helpers";
import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
  requiresAuth,
} from "@/lib/actionResult";
import axios from "axios";

type CheckoutSession = {
  url: string;
};

export default async function enrollFromAPI(
  id: string,
): Promise<ActionResult<CheckoutSession>> {
  const headers = await getToken();
  if (!("headers" in headers)) return requiresAuth();

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/checkout-session/${id}`,
      {
        ...headers,
      },
    );
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to pay");
    }
    return ok(res.data.session);
  } catch (e: any) {
    console.log(e.response?.data?.message);
    return fail(getAxiosErrorMessage(e, "Failed to pay"));
  }
}

export async function getEnrolledCourses(): Promise<ActionResult<any>> {
  const headers = await getToken();
  if (!("headers" in headers)) return requiresAuth();

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/my-courses/`,
      {
        ...headers,
      },
    );
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
  const headers = await getToken();
  if (!("headers" in headers)) return ok(false);

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/${id}`,
      {
        ...headers,
      },
    );
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to check enrollment");
    }
    return ok(Boolean(res.data.data));
  } catch (e) {
    console.log(e);
    return fail(getAxiosErrorMessage(e, "Something went wrong"));
  }
}
