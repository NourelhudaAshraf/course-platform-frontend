"use server";
import { getToken } from "@/lib/helpers";
import axios from "axios";

export async function getStatistics() {
  try {
    const headers = await getToken();
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/statistics/`,
      { ...headers },
    );
    if (res.status !== 200)
      throw new Error(res.data.message || "Failed to fetch statistics data");
    return res.data.data;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to fetch statistics data");
  }
}

export async function getLatestUsers() {
  try {
    const headers = await getToken();
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/latest-users`,
      { ...headers },
    );
    if (res.status !== 200)
      throw new Error(res.data.message || "Failed to fetch latest users data");
    return res.data.data;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to fetch latest users data");
  }
}
