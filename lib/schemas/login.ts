import { z } from "zod";

// Login schema (email + password only)
export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password is required"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
