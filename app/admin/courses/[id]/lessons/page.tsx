import { LessonsManager } from "@/components/lessons/LessonsManager";

type LessonsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LessonsPage({ params }: LessonsPageProps) {
  const { id } = await params;
  return <LessonsManager courseId={id} />;
}
