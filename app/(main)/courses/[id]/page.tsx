import { CourseDetailsPageProps } from "@/lib/types";
import { notFound } from "next/navigation";
import CourseDetails from "@/components/CourseDetails/page";
import { getUserLessonsForCourse } from "@/actions/lessons/getCompletedLessons";
import { getGeneralLessonsData } from "@/actions/lessons/getGeneralLessonsData";
import { getCourse as getCourseData } from "@/actions/courses/getCourse";
import { checkIsCourseEnrolled } from "@/actions/enroll";

export default async function CourseDetailsPage({
  params,
}: CourseDetailsPageProps) {
  const { id } = await params;

  const [courseResult, lessonsResult] = await Promise.all([
    getCourseData(id),
    getGeneralLessonsData(id),
  ]);
  const isEnrolled = await checkIsCourseEnrolled(id);
  let userLessons;
  if (isEnrolled.success && isEnrolled.data) {
    userLessons = await getUserLessonsForCourse(id);
  }
  console.log(userLessons);
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
