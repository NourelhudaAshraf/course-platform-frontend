import { api } from "@/lib/api";

export async function isUserEnrolledInCourse(
  courseId: string,
  token: string,
): Promise<boolean> {
  if (!token || token === "logout") return false;

  try {
    const res = await api.get(`/api/v1/enrollment/${courseId}`);
    if (res.status !== 200) return false;
    return Boolean(res.data.data);
  } catch {
    return false;
  }
}

export function getCourseIdFromLecturePath(pathname: string): string | null {
  const match = pathname.match(/^\/courses\/([^/]+)\/lecture(?:\/|$)/);
  return match?.[1] ?? null;
}
