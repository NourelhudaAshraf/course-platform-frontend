/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ResetPasswordFormData,
  ResetPasswordSchema,
} from "@/lib/schemas/resetPassword";
import axios from "axios";

export default function ResetPasswordForm({
  token,
}: {
  readonly token: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, {
        password: data.password,
      });
      if (res.status !== 200) throw new Error(res.data.message);
      toast.success("Password reset successful!", {
        description: "Redirecting to Home Page...",
      });
      router.refresh();
      router.replace("/");
    } catch (e: any) {
      if (axios.isAxiosError(e)) {
        toast.error("Reset failed", {
          description:
            (e.response?.data?.message as string) ||
            "Unable to reset password. The link may have expired.",
        });
      } else {
        toast.error("Reset failed", {
          description: (e.message as string) || "Something went wrong!",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              {...register("password")}
              disabled={isSubmitting}
              className="pr-10 min-h-10 border-gray-200 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              disabled={isSubmitting}
              className="pr-10 min-h-10 border-gray-200 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 mt-4">
        <Button
          type="submit"
          className="w-1/2 mx-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting..." : "Reset password"}
        </Button>

        <p className="text-sm text-center text-gray-600">
          <a href="/login" className="text-blue-600 hover:underline">
            Back to login
          </a>
        </p>
      </CardFooter>
    </form>
  );
}
