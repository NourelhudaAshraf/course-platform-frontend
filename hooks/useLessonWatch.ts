"use client";

import { watchLesson } from "@/actions/lessons/watchLesson";
import {
  PROGRESS_MIN_DELTA_SECONDS,
  PROGRESS_SAVE_INTERVAL_MS,
} from "@/lib/constants";
import { UserLessonSummary } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";

type UseLessonWatchOptions = {
  lessonId: string;
  totalSeconds?: number;
  initialUserLesson?: UserLessonSummary;
  initialUserLessons?: Record<string, UserLessonSummary>;
};

function saveWatchBeacon(lessonId: string, lastPosition: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl || lastPosition <= 0) return;

  fetch(`${apiUrl}/api/v1/users/watch-lesson`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    keepalive: true,
    body: JSON.stringify({
      lessonId,
      lastPosition: Math.floor(lastPosition),
    }),
  }).catch(() => {});
}

function toCompletedMap(
  userLessons: Record<string, UserLessonSummary>,
): Record<string, boolean> {
  return Object.fromEntries(
    Object.entries(userLessons).map(([id, record]) => [id, record.completed]),
  );
}

export function useLessonWatch({
  lessonId,
  totalSeconds,
  initialUserLesson,
  initialUserLessons = {},
}: UseLessonWatchOptions) {
  const [userLessonsMap, setUserLessonsMap] =
    useState<Record<string, UserLessonSummary>>(initialUserLessons);

  const lessonIdRef = useRef(lessonId);
  const currentPositionRef = useRef(initialUserLesson?.lastPosition ?? 0);
  const lastSavedPositionRef = useRef(initialUserLesson?.lastPosition ?? 0);
  const hasWatchedRef = useRef(
    (initialUserLesson?.lastPosition ?? 0) > 0 ||
      Boolean(initialUserLesson?.completed),
  );
  const lastSaveTimeRef = useRef(0);
  const isSavingRef = useRef(false);
  const pendingSaveRef = useRef<number | null>(null);
  // when the lessonId changes, update the lessonIdRef and set the userLessonsMap to the initialUserLessons
  useEffect(() => {
    lessonIdRef.current = lessonId;
    setUserLessonsMap(initialUserLessons);

    const startPosition = initialUserLesson?.lastPosition ?? 0;
    currentPositionRef.current = startPosition;
    lastSavedPositionRef.current = startPosition;
    hasWatchedRef.current =
      startPosition > 0 || Boolean(initialUserLesson?.completed);
    lastSaveTimeRef.current = 0;
  }, [lessonId, initialUserLesson, initialUserLessons]);

  const persistWatch = useCallback(async (position: number, force = false) => {
    const activeLessonId = lessonIdRef.current;
    const rounded = Math.floor(position);

    if (rounded < 0) return;
    if (rounded === 0 && !hasWatchedRef.current) return;
    if (rounded === lastSavedPositionRef.current && !force) return;

    const delta = Math.abs(rounded - lastSavedPositionRef.current);
    const elapsed = Date.now() - lastSaveTimeRef.current;

    if (!force) {
      if (
        elapsed < PROGRESS_SAVE_INTERVAL_MS &&
        delta < PROGRESS_MIN_DELTA_SECONDS
      ) {
        return;
      }
    }

    if (isSavingRef.current) {
      pendingSaveRef.current = rounded;
      return;
    }

    isSavingRef.current = true;
    try {
      const result = await watchLesson(activeLessonId, rounded);
      if (!result.success) return;
      lastSavedPositionRef.current = rounded;
      lastSaveTimeRef.current = Date.now();
      setUserLessonsMap((prev) => ({
        ...prev,
        [activeLessonId]: {
          completed: Boolean(result.data.completed),
          lastPosition: result.data.lastPosition,
        },
      }));
    } finally {
      isSavingRef.current = false;
      if (pendingSaveRef.current !== null) {
        const pending = pendingSaveRef.current;
        pendingSaveRef.current = null;
        void persistWatch(pending, true);
      }
    }
  }, []);

  const updatePosition = useCallback((position: number) => {
    if (position > 0) {
      hasWatchedRef.current = true;
    }
    currentPositionRef.current = position;
  }, []);

  const saveCurrentWatch = useCallback(
    (force = false) => persistWatch(currentPositionRef.current, force),
    [persistWatch],
  );

  const handleTimeUpdate = useCallback(
    (position: number) => {
      updatePosition(position);
      void persistWatch(position);
    },
    [persistWatch, updatePosition],
  );

  const handlePause = useCallback(() => {
    void persistWatch(currentPositionRef.current, true);
  }, [persistWatch]);

  const handleEnded = useCallback(() => {
    const finalPosition = totalSeconds ?? currentPositionRef.current;
    hasWatchedRef.current = true;
    currentPositionRef.current = finalPosition;
    void persistWatch(finalPosition, true);
  }, [persistWatch, totalSeconds]);

  const flushBeforeLeave = useCallback(() => {
    const position = currentPositionRef.current;
    if (position <= 0 || !hasWatchedRef.current) return;

    const delta = Math.abs(Math.floor(position) - lastSavedPositionRef.current);
    if (delta >= PROGRESS_MIN_DELTA_SECONDS) {
      saveWatchBeacon(lessonIdRef.current, position);
    }
  }, []);

  useEffect(() => {
    const activeLessonId = lessonId;

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        void saveCurrentWatch(true);
        flushBeforeLeave();
      }
    };

    const onBeforeUnload = () => flushBeforeLeave();

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", onBeforeUnload);

      const position = currentPositionRef.current;
      if (
        position > 0 &&
        hasWatchedRef.current &&
        position !== lastSavedPositionRef.current
      ) {
        void watchLesson(activeLessonId, position);
      }
    };
  }, [flushBeforeLeave, lessonId, saveCurrentWatch]);

  const startPosition = initialUserLesson?.completed
    ? 0
    : (initialUserLesson?.lastPosition ?? 0);
  const isCurrentCompleted = Boolean(userLessonsMap[lessonId]?.completed);
  const completedMap = toCompletedMap(userLessonsMap);

  return {
    completedMap,
    userLessonsMap,
    startPosition,
    isCurrentCompleted,
    handleTimeUpdate,
    handlePause,
    handleEnded,
    saveCurrentWatch,
  };
}
