"use server";

import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
} from "@/lib/actionResult";
import { LessonProps } from "@/lib/types";
import { api } from "@/lib/api";

export async function getGeneralLessonsData(
  courseId: string,
): Promise<ActionResult<LessonProps[]>> {
  try {
    const res = await api.get(`/api/v1/courses/${courseId}/lessons/general`);
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to fetch lessons");
    }
    console.log(res.data.data);
    return ok(res.data.data);
  } catch (error) {
    console.log(error);
    return fail(getAxiosErrorMessage(error, "Failed to fetch lessons"));
  }
}
