import { CourseDetailsPageProps } from "@/lib/types";
import { notFound } from "next/navigation";
import CourseDetails from "@/components/CourseDetails/page";
import { getUserLessonsForCourse } from "@/actions/lessons/getCompletedLessons";
import { getLessons } from "@/actions/lessons/getLessons";
import { getCourse as getCourseData } from "@/actions/courses/getCourse";

export default async function courseDetailsPage({
  params,
}: CourseDetailsPageProps) {
  const { id } = await params;

  const [courseResult, lessonsResult, userLessons] = await Promise.all([
    getCourseData(id),
    getLessons(id),
    getUserLessonsForCourse(id),
  ]);

  if (!courseResult.success || !lessonsResult.success) {
    notFound();
  }

  const course = courseResult.data;
  const lessons = lessonsResult.data;

  if (!course || !lessons) notFound();
  return (
    <CourseDetails
      course={course}
      lessons={lessons}
      userLessons={userLessons}
    />
  );
}
