"use client";

import { LectureDetailsProps } from "@/lib/types";
import BreadcrumbC from "../Breadcrumb/page";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Sidebar from "./Sidebar/page";
import { useLessonWatch } from "@/hooks/useLessonWatch";
import LectureContent from "./LectureContent/page";

export default function LectureDetails({
  lesson,
  allLessons,
  userLessons = {},
}: LectureDetailsProps) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const hasSeekedRef = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentUserLesson = userLessons[lesson._id];

  const {
    completedMap,
    startPosition,
    isCurrentCompleted,
    handleTimeUpdate,
    handlePause,
    handleEnded,
    saveCurrentWatch,
  } = useLessonWatch({
    lessonId: lesson._id,
    totalSeconds: lesson.totalSeconds,
    initialUserLesson: currentUserLesson, // from server
    initialUserLessons: userLessons, //all lessons progress
  });

  const seekToStart = () => {
    const player = playerRef.current;
    if (!player || hasSeekedRef.current || startPosition <= 0) return;

    player.currentTime = startPosition;
    hasSeekedRef.current = true;
  };

  useEffect(() => {
    hasSeekedRef.current = false;
  }, [lesson._id]);

  useEffect(() => {
    seekToStart();
  }, [lesson._id, startPosition]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/*Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
              <div className="flex flex-col gap-0 py-3">
                <BreadcrumbC courseTitle={lesson.course.title} />
                <h1 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {lesson.title}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isCurrentCompleted && (
                <Badge className="bg-green-100 text-green-700 text-sm">
                  Completed
                </Badge>
              )}
              <Badge variant="outline" className="text-sm">
                Lesson {lesson.order} of {allLessons.length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        <Sidebar
          lesson={lesson}
          allLessons={allLessons}
          isSidebarOpen={isSidebarOpen}
          completedLessons={completedMap}
          onBeforeNavigate={() => saveCurrentWatch(true)}
        />
        <LectureContent
          playerRef={playerRef}
          lesson={lesson}
          allLessons={allLessons}
          seekToStart={seekToStart}
          handleTimeUpdate={handleTimeUpdate}
          handlePause={handlePause}
          handleEnded={handleEnded}
          saveCurrentWatch={saveCurrentWatch}
        />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
