/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ForgotPasswordFormData,
  ForgotPasswordSchema,
} from "@/lib/schemas/forgotPassword";
import axios from "axios";

export default function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

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

  if (emailSent) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-dvh px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <MailCheck className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="font-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Check your email
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              We sent password reset instructions to{" "}
              <span className="font-medium text-gray-900">{submittedEmail}</span>
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-sm text-center text-gray-600">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
            <Button
              variant="outline"
              className="w-1/2 mx-auto"
              onClick={() => setEmailSent(false)}
            >
              Try again
            </Button>
            <p className="text-sm text-center text-gray-600">
              <a href="/login" className="text-blue-600 hover:underline">
                Back to login
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-dvh px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="font-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Forgot password
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Enter your email and we&apos;ll send you a link to reset your
            password
          </CardDescription>
        </CardHeader>
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
      </Card>
    </div>
  );
}
