import { getUserLessonsForCourse } from "@/actions/lessons/getCompletedLessons";
import { getLesson } from "@/actions/lessons/getLesson";
import { getLessons } from "@/actions/lessons/getLessons";
import LectureDetails from "@/components/LectureDetails/page";
import { LectureDetailsPageProps } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function courseDetailsPage({
  params,
}: LectureDetailsPageProps) {
  const { id, lessonId } = await params;

  const [lessonResult, lessonsResult, userLessons] = await Promise.all([
    getLesson(lessonId),
    getLessons(id),
    getUserLessonsForCourse(id),
  ]);

  if (!lessonResult.success || !lessonsResult.success) {
    notFound();
  }

  const lesson = lessonResult.data;
  const lessons = lessonsResult.data;

  if (!lesson) notFound();

  return (
    <LectureDetails
      lesson={lesson}
      allLessons={lessons}
      userLessons={userLessons}
    />
  );
}
