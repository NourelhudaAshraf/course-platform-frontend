"use server";
import { getToken } from "@/lib/helpers";
import { ProfileFormData } from "@/lib/schemas/profile";
import axios from "axios";

export async function getCurrentUser() {
  try {
    const headers = await getToken();
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`,
      {
        ...headers,
      },
    );
    if (res.status !== 200)
      throw new Error(res.data.message || "Failed to fetch user data");
    const { data: user } = await res.data;
    return user;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to fetch user data");
  }
}

export async function updateCurrentUserData(data: ProfileFormData) {
  try {
    const headers = await getToken();
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/update-me`,
      data,
      {
        ...headers,
      },
    );
    if (res.status !== 200)
      throw new Error(res.data.message || "Failed to get user data");
    const { data: user } = await res.data;
    return user;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to fetch user data");
  }
}
