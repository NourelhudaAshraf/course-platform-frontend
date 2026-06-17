/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Mail, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ProfileFormProps } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormData, updateProfileSchema } from "@/lib/schemas/profile";
import { useEffect, useState } from "react";

export default function ProfileForm({
  name,
  email,
  saveData,
}: ProfileFormProps) {
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProfileFormData>({ resolver: zodResolver(updateProfileSchema) });

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      const updateUser = await saveData(data);
      reset(updateUser);
    } catch (error: any) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (name !== "") setValue("name", name);
  }, [name, setValue]);

  useEffect(() => {
    if (email !== "") setValue("email", email);
  }, [email, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-5">
        <CardTitle className="mb-1 text-base">Profile Information</CardTitle>
        <CardDescription>Update your name and email address</CardDescription>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-gray-700">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            className={`pl-9 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            {...register("name")}
            disabled={saving}
          />
        </div>
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-gray-700">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={`pl-9 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            {...register("email")}
            disabled={saving}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
        <p>✓ Your changes will be saved to your account</p>
        <p>✓ Email address must be valid for notifications</p>
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
}
