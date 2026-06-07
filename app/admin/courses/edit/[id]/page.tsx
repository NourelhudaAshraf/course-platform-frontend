import { CourseFormPage } from "@/components/courses/CourseFormPage";

type EditCoursePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  return <CourseFormPage courseId={id} />;
}
