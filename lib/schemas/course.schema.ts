import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be 0 or greater"),
  image: z.string().min(1, "Image URL is required").url("Please enter a valid image URL"),
});

export type CourseFormData = z.infer<typeof courseSchema>;
