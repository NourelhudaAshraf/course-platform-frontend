import axios from "axios";

export const UNAUTHENTICATED = "UNAUTHENTICATED" as const;

export type ActionErrorCode = typeof UNAUTHENTICATED;

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code?: ActionErrorCode };

export function ok<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function fail<T = never>(
  error: string,
  code?: ActionErrorCode,
): ActionResult<T> {
  return code ? { success: false, error, code } : { success: false, error };
}

export function getAxiosErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message) return message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function requiresAuth<T>(): ActionResult<T> {
  return fail("Please login to continue", UNAUTHENTICATED);
}
