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

export async function createLesson(
  courseId: string,
  data: LessonFormData,
  videoFile: File,
): Promise<ActionResult<LessonProps>> {
  const headers = await getToken();
  if (!("headers" in headers)) return requiresAuth();

  try {
    const formData = await buildLessonFormData(data, videoFile);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${courseId}/lessons`,
      formData,
      { ...headers },
    );
    if (res.status !== 201 && res.status !== 200) {
      return fail(res.data.message || "Failed to create lesson");
    }
    return ok(res.data.data);
  } catch (error: any) {
    console.log(error.response?.data?.message);
    return fail(getAxiosErrorMessage(error, "Failed to create lesson"));
  }
}
