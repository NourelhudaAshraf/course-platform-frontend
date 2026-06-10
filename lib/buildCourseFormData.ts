import { CourseFormData } from "@/lib/schemas/course.schema";

export async function buildCourseFormData(
  data: CourseFormData,
  imageFile: File,
): Promise<FormData> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("price", data.price.toString());

  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const blob = new Blob([buffer], {
    type: imageFile.type || "application/octet-stream",
  });
  formData.append("image", blob, imageFile.name);

  return formData;
}
