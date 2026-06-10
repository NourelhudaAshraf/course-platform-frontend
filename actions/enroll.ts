/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getToken } from "@/lib/helpers";
import axios from "axios";

export default async function enrollFromAPI(id: string) {
  const headers = await getToken();
  if (!("headers" in headers)) {
    throw new Error("Please login to enroll in a course");
  }
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/checkout-session/${id}`,
      {
        ...headers,
      },
    );
    if (res.status !== 200)
      throw new Error(res.data.message || "Failed to pay");
    return res.data.session;
  } catch (e: any) {
    console.log(e.response?.data?.message);
    throw new Error(e.response?.data?.message || "Failed to pay");
  }
}

export async function getEnrolledCourses() {
  const headers = await getToken();
  if (!("headers" in headers)) return null;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/my-courses/`,
      {
        ...headers,
      },
    );
    if (res.status !== 200)
      throw new Error(res.data.message || "Failed to get enrolled courses");
    return res.data;
  } catch (e: any) {
    console.log(e.response?.data?.message);
    throw new Error(
      e.response?.data?.message || "Failed to get enrolled courses",
    );
  }
}

export async function checkIsCourseEnrolled(id: string) {
  const headers = await getToken();
  if (!("headers" in headers)) return null;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/${id}`,
      {
        ...headers,
      },
    );
    if (res.status !== 200) throw new Error(res.data.message);
    return res.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.log(e.response?.data?.status);
      throw new Error(e.response?.data?.message || "Something went wrong");
    }
  }
}
