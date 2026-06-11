"use server";

import { LIMIT } from "@/lib/constants";
import {
  ActionResult,
  fail,
  getAxiosErrorMessage,
  ok,
} from "@/lib/actionResult";
import { SearchData } from "@/lib/types";
import axios from "axios";

export async function getCourses(
  page: number,
  searchData?: SearchData,
): Promise<ActionResult<any>> {
  const params = new URLSearchParams();
  if (searchData?.minPrice) {
    params.append("minPrice", searchData.minPrice.toString());
  }
  if (searchData?.maxPrice) {
    params.append("maxPrice", searchData.maxPrice.toString());
  }
  if (searchData?.title) params.append("title", searchData.title);
  if (searchData?.sortBy) {
    const value = Object.values(searchData.sortBy)[0];
    params.append("sort", value as string);
  }
  params.append("page", page.toString());
  params.append("limit", LIMIT.toString());

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses?${params.toString()}`,
    );
    if (res.status !== 200) {
      return fail(res.data.message || "Failed to fetch courses");
    }
    return ok(res.data);
  } catch (error) {
    console.log(error);
    return fail(getAxiosErrorMessage(error, "Failed to fetch courses"));
  }
}
