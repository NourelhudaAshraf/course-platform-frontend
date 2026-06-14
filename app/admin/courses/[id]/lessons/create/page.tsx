import { LessonFormPage } from "@/components/lessons/LessonFormPage";

type CreateLessonPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CreateLessonPage({ params }: CreateLessonPageProps) {
  const { id } = await params;
  return <LessonFormPage courseId={id} />;
}
