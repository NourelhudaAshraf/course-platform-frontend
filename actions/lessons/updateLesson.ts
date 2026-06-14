/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { api, isAuthenticated } from "@/lib/api";
import { buildLessonFormData } from "@/lib/buildLessonFormData";
import { LessonFormData } from "@/lib/schemas/lesson.schema";
import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
  requiresAuth,
} from "@/lib/actionResult";
import { LessonProps } from "@/lib/types";

export async function updateLesson(
  lessonId: string,
  data: LessonFormData,
  videoFile?: File,
): Promise<ActionResult<LessonProps>> {
  if (!(await isAuthenticated())) return requiresAuth();

  try {
    if (videoFile) {
      const formData = await buildLessonFormData(data, videoFile);

      const res = await api.patch(`/api/v1/lessons/${lessonId}`, formData);
      if (res.status !== 200) {
        return fail(res.data.message || "Failed to update lesson");
      }
      return ok(res.data.data);
    }

    const res = await api.patch(`/api/v1/lessons/${lessonId}`, data);
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to update lesson");
    }
    return ok(res.data.data);
  } catch (error: any) {
    console.log(error);
    return fail(getAxiosErrorMessage(error, "Failed to update lesson"));
  }
}
