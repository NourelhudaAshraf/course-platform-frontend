"use server";

import { LIMIT } from "@/lib/constants";
import { getToken } from "@/lib/helpers";
import axios from "axios";

export async function getEnrollments(page = 1) {
  try {
    const headers = await getToken();
    const params = new URLSearchParams({
      page: page.toString(),
      limit: LIMIT.toString(),
    });
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment?${params.toString()}`,
      { ...headers },
    );
    if (res.status !== 200) {
      throw new Error(res.data.message || "Failed to fetch enrollments");
    }
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch enrollments");
  }
}
