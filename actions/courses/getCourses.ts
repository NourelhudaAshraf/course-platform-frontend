"use server";

import { LIMIT } from "@/lib/constants";
import { SearchData } from "@/lib/types";
import axios from "axios";

export async function getCourses(
  page: number,
  searchData?: SearchData,
) {
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
      throw new Error(res.data.message || "Failed to fetch courses");
    }
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch courses");
  }
}
