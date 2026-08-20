"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player";
import { useRouter } from "next/navigation";
import { LessonProps } from "@/lib/types";
import { Ref } from "react";

export default function LectureContent({
  playerRef,
  lesson,
  allLessons,
  seekToStart,
  handleTimeUpdate,
  handlePause,
  handleEnded,
  saveCurrentWatch,
}: {
  readonly playerRef: Ref<HTMLVideoElement> | undefined;
  readonly lesson: LessonProps;
  readonly allLessons: LessonProps[];
  readonly seekToStart: () => void;
  readonly handleTimeUpdate: (position: number) => void;
  readonly handlePause: () => void;
  readonly handleEnded: () => void;
  readonly saveCurrentWatch: (force: boolean) => Promise<void>;
}) {
  const router = useRouter();

  const currentIndex = allLessons.findIndex((l) => l._id === lesson._id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
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

  return (
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
            onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget.currentTime)}
            onPause={handlePause}
            onEnded={handleEnded}
          />
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
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
  );
}
