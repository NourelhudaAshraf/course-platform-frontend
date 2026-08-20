import { LessonFormPage } from "@/components/ManageLessons/LessonsFormPage/page";

type EditLessonPageProps = {
  params: Promise<{ id: string; lessonId: string }>;
};

export default async function EditLessonPage({ params }: EditLessonPageProps) {
  const { id, lessonId } = await params;
  return <LessonFormPage courseId={id} lessonId={lessonId} />;
}
