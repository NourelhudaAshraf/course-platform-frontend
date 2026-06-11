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

export async function deleteLesson(lessonId: string): Promise<ActionResult> {
  const headers = await getToken();
  if (!("headers" in headers)) return requiresAuth();

  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${lessonId}`,
      { ...headers },
    );
    if (res.status !== 204 && res.status !== 200) {
      return fail(res.data.message || "Failed to delete lesson");
    }
    return ok(undefined);
  } catch (error) {
    console.log(error);
    return fail(getAxiosErrorMessage(error, "Failed to delete lesson"));
  }
}
