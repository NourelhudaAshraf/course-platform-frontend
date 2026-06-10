/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getToken } from "@/lib/helpers";
import { buildCourseFormData } from "@/lib/buildCourseFormData";
import { CourseFormData } from "@/lib/schemas/course.schema";
import axios from "axios";

export async function updateCourse(
  id: string,
  data: CourseFormData,
  imageFile?: File,
) {
  try {
    const headers = await getToken();

    if (imageFile) {
      const formData = await buildCourseFormData(data, imageFile);
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${id}`,
        formData,
        { ...headers },
      );
      if (res.status !== 200) {
        throw new Error(res.data.message || "Failed to update course");
      }
      return res.data.data;
    }

    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${id}`,
      data,
      { ...headers },
    );
    if (res.status !== 200) {
      throw new Error(res.data.message || "Failed to update course");
    }
    return res.data.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response?.data?.message || "Failed to update course");
  }
}
