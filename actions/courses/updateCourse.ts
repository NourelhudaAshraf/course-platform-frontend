"use server";

import { getToken } from "@/lib/helpers";
import { CourseFormData } from "@/lib/schemas/course.schema";
import axios from "axios";

export async function updateCourse(id: string, data: CourseFormData) {
  try {
    const headers = await getToken();
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${id}`,
      data,
      { ...headers },
    );
    if (res.status !== 200) {
      throw new Error(res.data.message || "Failed to update course");
    }
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update course");
  }
}
