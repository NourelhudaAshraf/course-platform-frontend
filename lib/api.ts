import axios, { type InternalAxiosRequestConfig } from "axios";
import { getToken } from "@/lib/helpers";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const tokenConfig = await getToken();
  if ("headers" in tokenConfig && tokenConfig.headers?.Cookie) {
    config.headers.set("Cookie", tokenConfig.headers.Cookie);
  }
  return config;
});

export async function isAuthenticated(): Promise<boolean> {
  const tokenConfig = await getToken();
  return "headers" in tokenConfig;
}
