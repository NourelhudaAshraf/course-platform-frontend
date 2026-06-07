"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Save } from "lucide-react";
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
import { courseSchema, CourseFormData } from "@/lib/schemas/course.schema";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CourseForm({
  defaultValues,
  onSubmit,
  loading = false,
  submitLabel = "Save Course",
}: CourseFormComponentProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: defaultValues ?? {
      title: "",
      description: "",
      price: 0,
      image: "",
    },
  });

  const imageUrl = (useWatch({ control, name: "image" }) ?? "").trim();

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Course Details</CardTitle>
        <CardDescription>Fill in the course information below</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
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
              label="Image URL"
              error={errors.image?.message}
              required
            >
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                {...register("image")}
                disabled={loading}
              />
            </FormField>

            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/80 p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Preview
              </p>
              <div className="relative mx-auto aspect-video w-full max-w-sm overflow-hidden rounded-lg border bg-white shadow-sm">
                <CourseImagePreview key={imageUrl} url={imageUrl} />
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

function isValidImageUrl(url: string) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function getPreviewPlaceholderMessage(url: string, loadFailed: boolean) {
  if (loadFailed) {
    return "Could not load image. Check the URL and try again.";
  }
  if (url && !isValidImageUrl(url)) {
    return "Enter a valid URL (e.g. https://…)";
  }
  return "Enter an image URL above to see a preview";
}

function CourseImagePreview({ url }: { readonly url: string }) {
  const [loadFailed, setLoadFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const canPreview = isValidImageUrl(url) && !loadFailed;

  if (!canPreview) {
    return (
      <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 px-4 text-center text-gray-400">
        <ImageIcon className="h-10 w-10 stroke-[1.5]" />
        <p className="text-sm">
          {getPreviewPlaceholderMessage(url, loadFailed)}
        </p>
      </div>
    );
  }

  return (
    <>
      {!loaded && <Skeleton className="absolute inset-0 h-full w-full" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
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
