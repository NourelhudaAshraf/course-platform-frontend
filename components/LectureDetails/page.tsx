"use client";

import { LectureDetailsProps } from "@/lib/types";
import BreadcrumbC from "../Breadcrumb/page";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactPlayer from "react-player";
import Sidebar from "./Sidebar/page";
import { useLessonWatch } from "@/hooks/useLessonWatch";

export default function LectureDetails({
  lesson,
  allLessons,
  userLessons = {},
}: LectureDetailsProps) {
  const router = useRouter();
  const playerRef = useRef<HTMLVideoElement>(null);
  const hasSeekedRef = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentUserLesson = userLessons[lesson._id];

  const currentIndex = allLessons.findIndex((l) => l._id === lesson._id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

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

  const navigateToLesson = async (targetLessonId: string) => {
    await saveCurrentWatch(true);
    router.push(`/courses/${lesson.course._id}/lecture/${targetLessonId}`);
  };

  const handleNextLesson = () => {
    if (nextLesson) navigateToLesson(nextLesson._id);
  };

  const handlePreviousLesson = () => {
    if (prevLesson) navigateToLesson(prevLesson._id);
  };

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

        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video">
              <ReactPlayer
                ref={playerRef}
                src={lesson.videoUrl}
                controls
                width="100%"
                height="100%"
                onReady={seekToStart}
                onLoadedMetadata={seekToStart}
                onTimeUpdate={(e) =>
                  handleTimeUpdate(e.currentTarget.currentTime)
                }
                onPause={handlePause}
                onEnded={handleEnded}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {lesson.title}
              </h2>
              <p className="text-base font-medium text-gray-600">
                {lesson.description}
              </p>
            </div>

            <div className="mt-6 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handlePreviousLesson}
                  disabled={!prevLesson}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                  {prevLesson && (
                    <span className="hidden sm:inline ml-1">
                      {prevLesson.title}
                    </span>
                  )}
                </Button>

                <Button
                  onClick={handleNextLesson}
                  disabled={!nextLesson}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                  {nextLesson && (
                    <span className="hidden sm:inline ml-1">
                      {nextLesson.title}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </main>
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
