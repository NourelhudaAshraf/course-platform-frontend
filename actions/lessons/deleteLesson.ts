"use server";

import { api, isAuthenticated } from "@/lib/api";
import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
  requiresAuth,
} from "@/lib/actionResult";

export async function deleteLesson(lessonId: string): Promise<ActionResult> {
  if (!(await isAuthenticated())) return requiresAuth();

  try {
    const res = await api.delete(`/api/v1/lessons/${lessonId}`);
    if (res.status !== 204 && res.status !== 200) {
      return fail(res.data.message || "Failed to delete lesson");
    }
    return ok(undefined);
  } catch (error) {
    console.log(error);
    return fail(getAxiosErrorMessage(error, "Failed to delete lesson"));
  }
}
