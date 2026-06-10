import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be 0 or greater"),
});

export type CourseFormData = z.infer<typeof courseSchema>;

export type CourseFormSubmitData = CourseFormData & {
  image?: File;
};
