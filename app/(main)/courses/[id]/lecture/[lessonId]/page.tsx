import { getUserLessonsForCourse } from "@/actions/lessons/getCompletedLessons";
import { getLesson } from "@/actions/lessons/getLesson";
import { getLessons } from "@/actions/lessons/getLessons";
import LectureDetails from "@/components/LectureDetails/page";
import { LectureDetailsPageProps, LessonProps, UserLessonSummary } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function courseDetailsPage({
  params,
}: LectureDetailsPageProps) {
  const { id, lessonId } = await params;
  let lesson: LessonProps;
  let lessons: LessonProps[];
  let userLessons: Record<string, UserLessonSummary>;

  try {
    [lesson, lessons, userLessons] = await Promise.all([
      getLesson(lessonId),
      getLessons(id),
      getUserLessonsForCourse(id),
    ]);
  } catch (e) {
    console.log(e);
    notFound();
  }
  if (!lesson) notFound();

  return (
    <LectureDetails
      lesson={lesson}
      allLessons={lessons}
      userLessons={userLessons}
    />
  );
}
