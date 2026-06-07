"use server";

import { getToken } from "@/lib/helpers";
import { UserLessonProps } from "@/lib/types";
import axios from "axios";

export async function watchLesson(
  lessonId: string,
  lastPosition: number,
): Promise<UserLessonProps> {
  const headers = await getToken();
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/watch-lesson`,
      { lessonId, lastPosition: Math.floor(lastPosition) },
      headers,
    );

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(res.data.message || "Failed to save lesson progress");
    }

    return res.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to save lesson progress");
  }
}
