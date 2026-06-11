"use server";

import { getToken } from "@/lib/helpers";
import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
  requiresAuth,
} from "@/lib/actionResult";
import { UserLessonProps } from "@/lib/types";
import axios from "axios";

export async function watchLesson(
  lessonId: string,
  lastPosition: number,
): Promise<ActionResult<UserLessonProps>> {
  const headers = await getToken();
  if (!("headers" in headers)) return requiresAuth();

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/watch-lesson`,
      { lessonId, lastPosition: Math.floor(lastPosition) },
      headers,
    );

    if (res.status !== 200 && res.status !== 201) {
      return fail(res.data.message || "Failed to save lesson progress");
    }

    return ok(res.data.data);
  } catch (error) {
    console.log(error);
    return fail(getAxiosErrorMessage(error, "Failed to save lesson progress"));
  }
}
