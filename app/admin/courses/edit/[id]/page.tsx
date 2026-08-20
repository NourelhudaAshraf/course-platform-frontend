import { CourseFormPage } from "@/components/ManageCourses/CourseFormPage/page";

type EditCoursePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  return <CourseFormPage courseId={id} />;
}
