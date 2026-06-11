/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getToken } from "@/lib/helpers";
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
import axios from "axios";

export async function updateLesson(
  lessonId: string,
  data: LessonFormData,
  videoFile?: File,
): Promise<ActionResult<LessonProps>> {
  const headers = await getToken();
  if (!("headers" in headers)) return requiresAuth();

  try {
    if (videoFile) {
      const formData = await buildLessonFormData(data, videoFile);

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${lessonId}`,
        formData,
        { ...headers },
      );
      if (res.status !== 200) {
        return fail(res.data.message || "Failed to update lesson");
      }
      return ok(res.data.data);
    }

    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${lessonId}`,
      data,
      { ...headers },
    );
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to update lesson");
    }
    return ok(res.data.data);
  } catch (error: any) {
    console.log(error);
    return fail(getAxiosErrorMessage(error, "Failed to update lesson"));
  }
}
