/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getToken } from "@/lib/helpers";
import { buildLessonFormData } from "@/lib/buildLessonFormData";
import { LessonFormData } from "@/lib/schemas/lesson.schema";
import axios from "axios";

export async function updateLesson(
  lessonId: string,
  data: LessonFormData,
  videoFile?: File,
) {
  try {
    const headers = await getToken();

    if (videoFile) {
      const formData = await buildLessonFormData(data, videoFile);

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${lessonId}`,
        formData,
        { ...headers },
      );
      if (res.status !== 200) {
        throw new Error(res.data.message || "Failed to update lesson");
      }
      return res.data.data;
    }

    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${lessonId}`,
      data,
      { ...headers },
    );
    if (res.status !== 200) {
      throw new Error(res.data.message || "Failed to update lesson");
    }
    return res.data.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response?.data?.message || "Failed to update lesson");
  }
}
