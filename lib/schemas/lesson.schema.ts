import { z } from "zod";

export const lessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  order: z.number().int().positive("Order must be a positive number"),
});

export type LessonFormData = z.infer<typeof lessonSchema>;

export type LessonFormSubmitData = LessonFormData & {
  video?: File;
};
