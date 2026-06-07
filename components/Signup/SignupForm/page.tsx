/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema, SignupFormData } from "@/lib/schemas/signup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    try {
      const res = await axios.post("/api/auth/signup", data);
      if (res.status !== 201) throw new Error(res.data.message);
      toast.success("Signup successful!", {
        description: "Redirecting to Home Page...",
      });
      router.refresh();
      router.replace("/");
    } catch (e: any) {
      if (axios.isAxiosError(e)) {
        console.log(e.response?.data?.message);
        toast.error("Signup failed", {
          description:
            (e.response?.data?.message as string) ||
            "Invalid name or email or password",
        });
      } else {
        console.log(e);
        toast.error("Signup failed", {
          description: (e.message as string) || "Something went wrong!",
        });
      }
    } finally {
      router.refresh();
    }
  };
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-dvh">
      <Card className="w-full max-w-md mx-auto py-4">
        <CardHeader>
          <CardTitle className="font-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create an account
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Sign up to get started with our platform
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="my-1">
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Input
                id="name"
                placeholder="Full Name (e.g. John Doe)"
                {...register("name")}
                className="min-h-10 border-gray-200 focus:border-blue-500"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email (e.g.you@example.com)"
                className="min-h-10 border-gray-200 focus:border-blue-500"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="mt-4">
            <Button
              type="submit"
              className="w-1/2 mx-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
