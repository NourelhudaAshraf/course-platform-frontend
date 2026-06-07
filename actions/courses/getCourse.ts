"use server";

import axios from "axios";

export async function getCourse(id: string) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${id}`,
    );
    if (res.status !== 200) {
      throw new Error(res.data.message || "Failed to fetch course");
    }
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch course");
  }
}
