/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getToken } from "@/lib/helpers";
import { buildLessonFormData } from "@/lib/buildLessonFormData";
import { LessonFormData } from "@/lib/schemas/lesson.schema";
import axios from "axios";

export async function createLesson(
  courseId: string,
  data: LessonFormData,
  videoFile: File,
) {
  try {
    const headers = await getToken();
    const formData = await buildLessonFormData(data, videoFile);
    console.log("formData", formData);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${courseId}/lessons`,
      formData,
      { ...headers },
    );
    if (res.status !== 201 && res.status !== 200) {
      throw new Error(res.data.message || "Failed to create lesson");
    }
    return res.data.data;
  } catch (error: any) {
    console.log(error.response?.data?.message);
    throw new Error(error.response?.data?.message || "Failed to create lesson");
  }
}
