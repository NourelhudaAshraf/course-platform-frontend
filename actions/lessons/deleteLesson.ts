"use server";

import { getToken } from "@/lib/helpers";
import axios from "axios";

export async function deleteLesson(lessonId: string) {
  try {
    const headers = await getToken();
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${lessonId}`,
      { ...headers },
    );
    if (res.status !== 204 && res.status !== 200) {
      throw new Error(res.data.message || "Failed to delete lesson");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete lesson");
  }
}
