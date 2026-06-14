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

export async function createLesson(
  courseId: string,
  data: LessonFormData,
  videoFile: File,
): Promise<ActionResult<LessonProps>> {
  if (!(await isAuthenticated())) return requiresAuth();

  try {
    const formData = await buildLessonFormData(data, videoFile);
    const res = await api.post(`/api/v1/courses/${courseId}/lessons`, formData);
    if (res.status !== 201 && res.status !== 200) {
      return fail(res.data.message || "Failed to create lesson");
    }
    return ok(res.data.data);
  } catch (error: any) {
    console.log(error.response?.data?.message);
    return fail(getAxiosErrorMessage(error, "Failed to create lesson"));
  }
}
