"use server";

import { api, isAuthenticated } from "@/lib/api";
import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
  requiresAuth,
} from "@/lib/actionResult";
import { UserLessonProps } from "@/lib/types";

export async function watchLesson(
  lessonId: string,
  lastPosition: number,
): Promise<ActionResult<UserLessonProps>> {
  if (!(await isAuthenticated())) return requiresAuth();

  try {
    const res = await api.post("/api/v1/users/watch-lesson", {
      lessonId,
      lastPosition: Math.floor(lastPosition),
    });

    if (res.status !== 200 && res.status !== 201) {
      return fail(res.data.message || "Failed to save lesson progress");
    }

    return ok(res.data.data);
  } catch (error) {
    console.log(error);
    return fail(getAxiosErrorMessage(error, "Failed to save lesson progress"));
  }
}
