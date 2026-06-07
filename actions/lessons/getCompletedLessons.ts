"use server";

import { getToken } from "@/lib/helpers";
import { UserLessonSummary } from "@/lib/types";
import axios from "axios";

type UserLessonRecord = {
  lesson?: string | { _id: string };
  completed?: boolean;
  lastPosition?: number;
};

function resolveLessonId(lesson: UserLessonRecord["lesson"]): string | null {
  if (typeof lesson === "string") return lesson;
  if (lesson && typeof lesson === "object" && "_id" in lesson) {
    return lesson._id;
  }
  return null;
}

function toUserLessonsMap(data: unknown): Record<string, UserLessonSummary> {
  if (!data) return {};

  if (Array.isArray(data)) {
    return data.reduce<Record<string, UserLessonSummary>>((acc, item) => {
      if (typeof item !== "object" || item === null) return acc;

      const record = item as UserLessonRecord;
      const lessonId = resolveLessonId(record.lesson);
      if (!lessonId) return acc;

      acc[lessonId] = {
        completed: Boolean(record.completed),
        lastPosition: Number(record.lastPosition ?? 0),
      };
      return acc;
    }, {});
  }

  if (typeof data === "object") {
    return Object.entries(data as Record<string, UserLessonRecord>).reduce<
      Record<string, UserLessonSummary>
    >((acc, [lessonId, record]) => {
      if (typeof record === "boolean") {
        acc[lessonId] = { completed: record, lastPosition: 0 };
        return acc;
      }

      acc[lessonId] = {
        completed: Boolean(record.completed),
        lastPosition: Number(record.lastPosition ?? 0),
      };
      return acc;
    }, {});
  }

  return {};
}

/** Fetches UserLesson records for a course (completed + lastPosition). */
export async function getUserLessonsForCourse(
  courseId: string,
): Promise<Record<string, UserLessonSummary>> {
  const headers = await getToken();
  if (!("headers" in headers)) return {};

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/courses/${courseId}/user-lessons`,
      headers,
    );

    if (res.status !== 200) return {};

    return toUserLessonsMap(res.data?.data);
  } catch (error) {
    console.log(error);

    try {
      const fallback = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/courses/${courseId}/completed-lessons`,
        headers,
      );

      if (fallback.status !== 200) return {};

      return toUserLessonsMap(fallback.data?.data);
    } catch {
      return {};
    }
  }
}

/** @deprecated use getUserLessonsForCourse */
export async function getCompletedLessons(
  courseId: string,
): Promise<Record<string, boolean>> {
  const userLessons = await getUserLessonsForCourse(courseId);
  return Object.fromEntries(
    Object.entries(userLessons).map(([id, record]) => [id, record.completed]),
  );
}
