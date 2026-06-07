/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Mail, Save, Loader2 } from "lucide-react";
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
    <Card>
      <CardHeader className="mb-2">
        <CardTitle className="mb-1">Profile Information</CardTitle>
        <CardDescription>Update your name and email address</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className={`pl-9 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                {...register("name")}
                disabled={saving}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`pl-9 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                {...register("email")}
                disabled={saving}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Form Info */}
          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700 flex flex-col gap-3 mb-5">
            <p>✓ Your changes will be saved to your account</p>
            <p>✓ Email address must be valid for notifications</p>
          </div>
        </CardContent>

        {/* Form Actions */}
        <div className="px-6 pb-1">
          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
