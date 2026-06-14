/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { api, isAuthenticated } from "@/lib/api";
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

export async function updateCourse(
  id: string,
  data: CourseFormData,
  imageFile?: File,
): Promise<ActionResult<CourseProps>> {
  if (!(await isAuthenticated())) return requiresAuth();

  try {
    if (imageFile) {
      const formData = await buildCourseFormData(data, imageFile);
      const res = await api.patch(`/api/v1/courses/${id}`, formData);
      if (res.status !== 200) {
        return fail(res.data.message || "Failed to update course");
      }
      return ok(res.data.data);
    }

    const res = await api.patch(`/api/v1/courses/${id}`, data);
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to update course");
    }
    return ok(res.data.data);
  } catch (error: any) {
    console.log(error);
    return fail(getAxiosErrorMessage(error, "Failed to update course"));
  }
}
