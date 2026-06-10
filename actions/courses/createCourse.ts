/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getToken } from "@/lib/helpers";
import { buildCourseFormData } from "@/lib/buildCourseFormData";
import { CourseFormData } from "@/lib/schemas/course.schema";
import axios from "axios";

export async function createCourse(data: CourseFormData, imageFile: File) {
  try {
    const headers = await getToken();
    const formData = await buildCourseFormData(data, imageFile);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses`,
      formData,
      { ...headers },
    );
    if (res.status !== 201 && res.status !== 200) {
      throw new Error(res.data.message || "Failed to create course");
    }
    return res.data.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response?.data?.message || "Failed to create course");
  }
}
