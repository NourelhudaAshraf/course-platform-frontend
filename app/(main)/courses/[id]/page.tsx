import {
  CourseDetailsPageProps,
  CourseProps,
  LessonProps,
  UserLessonSummary,
} from "@/lib/types";
import { notFound } from "next/navigation";
import CourseDetails from "@/components/CourseDetails/page";
import { getUserLessonsForCourse } from "@/actions/lessons/getCompletedLessons";
import { getLessons } from "@/actions/lessons/getLessons";
import { getCourse as getCourseData } from "@/actions/courses/getCourse";

export default async function courseDetailsPage({
  params,
}: CourseDetailsPageProps) {
  const { id } = await params;
  let course: CourseProps;
  let lessons: LessonProps[];
  let userLessons: Record<string, UserLessonSummary>;

  try {
    [course, lessons, userLessons] = await Promise.all([
      getCourseData(id),
      getLessons(id),
      getUserLessonsForCourse(id),
    ]);
  } catch (e) {
    console.log(e);
    notFound();
  }
  if (!course || !lessons) notFound();
  return (
    <CourseDetails
      course={course}
      lessons={lessons}
      userLessons={userLessons}
    />
  );
}
