/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updatePassword } from "@/actions/auth";
import {
  ChangePasswordFormData,
  ChangePasswordSchema,
} from "@/lib/schemas/changePassword";

function PasswordField({
  id,
  label,
  placeholder,
  error,
  disabled,
  register,
}: {
  readonly id: string;
  readonly label: string;
  readonly placeholder: string;
  readonly error?: string;
  readonly disabled: boolean;
  readonly register: ReturnType<
    typeof useForm<ChangePasswordFormData>
  >["register"];
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-gray-700">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className={`pr-10 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          disabled={disabled}
          {...register(id as keyof ChangePasswordFormData)}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default function ChangePasswordForm() {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setSaving(true);
    try {
      const result = await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (result.success) {
        toast.success("Password updated successfully!");
        reset();
        return;
      }

      toast.error("Failed to update password", {
        description: result.error,
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password", {
        description: error.message || "Something went wrong!",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-5">
        <CardTitle className="mb-1 text-base">Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </div>

      <PasswordField
        id="currentPassword"
        label="Current password"
        placeholder="Current password"
        error={errors.currentPassword?.message}
        disabled={saving}
        register={register}
      />
      <PasswordField
        id="newPassword"
        label="New password"
        placeholder="New password"
        error={errors.newPassword?.message}
        disabled={saving}
        register={register}
      />
      <PasswordField
        id="confirmNewPassword"
        label="Confirm password"
        placeholder="Confirm password"
        error={errors.confirmNewPassword?.message}
        disabled={saving}
        register={register}
      />
      <div className="flex flex-col gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
        <p>✓ Your changes will be saved to your account</p>
      </div>
      <Button
        type="submit"
        disabled={saving}
        className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
}
