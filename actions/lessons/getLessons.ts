"use server";

import axios from "axios";

export async function getLessons(courseId: string) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${courseId}/lessons`,
    );
    if (res.status !== 200) {
      throw new Error(res.data.message || "Failed to fetch lessons");
    }
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch lessons");
  }
}
