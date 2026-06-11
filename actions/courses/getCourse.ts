"use server";

import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
} from "@/lib/actionResult";
import { CourseProps } from "@/lib/types";
import axios from "axios";

export async function getCourse(id: string): Promise<ActionResult<CourseProps>> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${id}`,
    );
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to fetch course");
    }
    return ok(res.data.data);
  } catch (error) {
    console.log(error);
    return fail(getAxiosErrorMessage(error, "Failed to fetch course"));
  }
}
