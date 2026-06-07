import { redirect } from "next/navigation";

type LecturePageProps = {
  params: Promise<{ id: string }>;
};

export default async function LecturePage({ params }: LecturePageProps) {
  const { id } = await params;
  redirect(`/courses/${id}`);
}
