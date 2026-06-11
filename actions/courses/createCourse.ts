/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getToken } from "@/lib/helpers";
import { buildCourseFormData } from "@/lib/buildCourseFormData";
import { CourseFormData } from "@/lib/schemas/course.schema";
import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
  requiresAuth,
} from "@/lib/actionResult";
import { CourseProps } from "@/lib/types";
import axios from "axios";

export async function createCourse(
  data: CourseFormData,
  imageFile: File,
): Promise<ActionResult<CourseProps>> {
  const headers = await getToken();
  if (!("headers" in headers)) return requiresAuth();

  try {
    const formData = await buildCourseFormData(data, imageFile);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses`,
      formData,
      { ...headers },
    );
    if (res.status !== 201 && res.status !== 200) {
      return fail(res.data.message || "Failed to create course");
    }
    return ok(res.data.data);
  } catch (error: any) {
    console.log(error);
    return fail(getAxiosErrorMessage(error, "Failed to create course"));
  }
}
