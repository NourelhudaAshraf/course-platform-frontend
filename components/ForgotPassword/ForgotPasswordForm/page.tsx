/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ForgotPasswordFormData,
  ForgotPasswordSchema,
} from "@/lib/schemas/forgotPassword";
import axios from "axios";

export default function ForgotPasswordForm({
  setSubmittedEmail,
  setEmailSent,
}: {
  readonly setSubmittedEmail: (email: string) => void;
  readonly setEmailSent: (isEmailSent: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const res = await axios.post("/api/auth/forgot-password", data);
      if (res.status !== 200) throw new Error(res.data.message);
      setSubmittedEmail(data.email);
      setEmailSent(true);
      toast.success("Email sent!", {
        description: "Check your inbox for reset instructions.",
      });
    } catch (e: any) {
      if (axios.isAxiosError(e)) {
        toast.error("Request failed", {
          description:
            (e.response?.data?.message as string) ||
            "Unable to send reset email. Please try again.",
        });
      } else {
        toast.error("Request failed", {
          description: (e.message as string) || "Something went wrong!",
        });
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Input
            id="email"
            type="email"
            placeholder="Email (e.g.you@example.com)"
            {...register("email")}
            className="min-h-10 border-gray-200 focus:border-blue-500"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 mt-4">
        <Button
          type="submit"
          className="w-1/2 mx-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>

        <p className="text-sm text-center text-gray-600">
          Remember your password?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </CardFooter>
    </form>
  );
}
