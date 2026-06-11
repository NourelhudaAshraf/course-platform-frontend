"use server";

import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
} from "@/lib/actionResult";
import { LessonProps } from "@/lib/types";
import axios from "axios";

export async function getLesson(
  lessonId: string,
): Promise<ActionResult<LessonProps>> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${lessonId}`,
    );
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to fetch lesson");
    }
    return ok(res.data.data);
  } catch (error) {
    console.log(error);
    return fail(getAxiosErrorMessage(error, "Failed to fetch lesson"));
  }
}
