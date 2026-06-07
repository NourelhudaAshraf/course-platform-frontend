"use server";

import axios from "axios";

export async function getLesson(lessonId: string) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${lessonId}`,
    );
    if (res.status !== 200) {
      throw new Error(res.data.message || "Failed to fetch lesson");
    }
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch lesson");
  }
}
