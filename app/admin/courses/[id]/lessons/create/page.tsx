import { LessonFormPage } from "@/components/ManageLessons/LessonsFormPage/page";

type CreateLessonPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CreateLessonPage({
  params,
}: CreateLessonPageProps) {
  const { id } = await params;
  return <LessonFormPage courseId={id} />;
}
