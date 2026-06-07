"use server";
import { LIMIT } from "@/lib/constants";
import { getToken } from "@/lib/helpers";
import axios from "axios";

export async function getAllUsers(page: number) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", LIMIT.toString());
  try {
    const headers = await getToken();
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users?${params.toString()}`,
      {
        ...headers,
      },
    );
    if (res.status !== 200)
      throw new Error(res.data.message || "Failed to fetch users data");
    return res.data;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to fetch users data");
  }
}

export async function deleteUser(id: string) {
  try {
    const headers = await getToken();
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${id}`,
      {
        ...headers,
      },
    );
    if (res.status !== 204)
      throw new Error(res.data.message || "Failed to delete user");
  } catch (e) {
    console.log(e);
    throw new Error("Failed to delete user");
  }
}

export async function promoteUser(id: string) {
  try {
    const headers = await getToken();
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/promote/${id}`,
      {},
      {
        ...headers,
      },
    );
    if (res.status !== 200)
      throw new Error(res.data.message || "Failed to promote user");
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.log(e.response?.data?.status);
      throw new Error(e.response?.data?.message || "Something went wrong");
    }
  }
}
