import { LessonFormData } from "@/lib/schemas/lesson.schema";

export async function buildLessonFormData(
  data: LessonFormData,
  videoFile: File,
): Promise<FormData> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("order", data.order.toString());

  const buffer = Buffer.from(await videoFile.arrayBuffer());
  const blob = new Blob([buffer], {
    type: videoFile.type || "application/octet-stream",
  });
  formData.append("video", blob, videoFile.name);

  return formData;
}
