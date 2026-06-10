"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CourseFormComponentProps } from "@/lib/types";
import {
  courseSchema,
  CourseFormData,
  CourseFormSubmitData,
} from "@/lib/schemas/course.schema";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp,image/gif";

export function CourseForm({
  defaultValues,
  existingImageUrl,
  isEdit = false,
  onSubmit,
  loading = false,
  submitLabel = "Save Course",
}: CourseFormComponentProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: defaultValues ?? {
      title: "",
      description: "",
      price: 0,
    },
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (imagePreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    if (!file) {
      setImageFile(null);
      setImagePreviewUrl(
        isEdit && existingImageUrl ? existingImageUrl : null,
      );
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file");
      setImageFile(null);
      setImagePreviewUrl(
        isEdit && existingImageUrl ? existingImageUrl : null,
      );
      return;
    }

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleFormSubmit = async (data: CourseFormData) => {
    if (!isEdit && !imageFile) {
      setImageError("Please upload an image");
      return;
    }

    const payload: CourseFormSubmitData = {
      ...data,
      ...(imageFile ? { image: imageFile } : {}),
    };
    await onSubmit(payload);
  };

  const previewSrc =
    imagePreviewUrl ?? (isEdit && existingImageUrl ? existingImageUrl : null);

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Course Details</CardTitle>
        <CardDescription>Fill in the course information below</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-6">
          <FormField
            id="title"
            label="Title"
            error={errors.title?.message}
            required
          >
            <Input
              id="title"
              placeholder="Course title"
              {...register("title")}
              disabled={loading}
            />
          </FormField>

          <FormField
            id="description"
            label="Description"
            error={errors.description?.message}
            required
          >
            <textarea
              id="description"
              placeholder="Course description"
              rows={4}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register("description")}
              disabled={loading}
            />
          </FormField>

          <FormField
            id="price"
            label="Price"
            error={errors.price?.message}
            required
          >
            <Input
              id="price"
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              {...register("price", { valueAsNumber: true })}
              disabled={loading}
            />
          </FormField>

          <div className="space-y-3">
            <FormField
              id="image"
              label={isEdit ? "Replace image (optional)" : "Course image"}
              error={imageError ?? undefined}
              required={!isEdit}
            >
              <input
                ref={fileInputRef}
                id="image"
                type="file"
                accept={ACCEPTED_IMAGE_TYPES}
                className="hidden"
                onChange={handleImageChange}
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {imageFile ? imageFile.name : "Choose image from your device"}
              </Button>
            </FormField>

            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/80 p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Preview
              </p>
              <div className="relative mx-auto aspect-video w-full max-w-sm overflow-hidden rounded-lg border bg-white shadow-sm">
                <CourseImagePreview key={previewSrc} src={previewSrc} />
              </div>
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {submitLabel}
              </>
            )}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}

function CourseImagePreview({ src }: { readonly src: string | null }) {
  const [loadFailed, setLoadFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || loadFailed) {
    return (
      <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 px-4 text-center text-gray-400">
        <ImageIcon className="h-10 w-10 stroke-[1.5]" />
        <p className="text-sm">
          {loadFailed
            ? "Could not load image. Try another file."
            : "Upload an image to see a preview"}
        </p>
      </div>
    );
  }

  return (
    <>
      {!loaded && <Skeleton className="absolute inset-0 h-full w-full" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Course preview"
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setLoadFailed(true)}
      />
    </>
  );
}

function FormField({
  id,
  label,
  error,
  required,
  children,
}: {
  readonly id: string;
  readonly label: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
