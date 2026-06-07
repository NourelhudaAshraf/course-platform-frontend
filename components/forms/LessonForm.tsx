"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Save, Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonFormComponentProps } from "@/lib/types";
import {
  lessonSchema,
  LessonFormData,
  LessonFormSubmitData,
} from "@/lib/schemas/lesson.schema";
import { cn } from "@/lib/utils";

const ACCEPTED_VIDEO_TYPES = "video/mp4,video/webm,video/ogg,video/quicktime";

export function LessonForm({
  course,
  defaultValues,
  existingVideoUrl,
  isEdit = false,
  onSubmit,
  loading = false,
  submitLabel = "Save Lesson",
}: LessonFormComponentProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: defaultValues ?? {
      title: "",
      order: 1,
    },
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setVideoError(null);

    if (videoPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreviewUrl);
    }

    if (!file) {
      setVideoFile(null);
      setVideoPreviewUrl(isEdit && existingVideoUrl ? existingVideoUrl : null);
      return;
    }

    if (!file.type.startsWith("video/")) {
      setVideoError("Please select a valid video file");
      setVideoFile(null);
      setVideoPreviewUrl(isEdit && existingVideoUrl ? existingVideoUrl : null);
      return;
    }

    setVideoFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
  };

  const handleFormSubmit = async (data: LessonFormData) => {
    if (!isEdit && !videoFile) {
      setVideoError("Please upload a video file");
      return;
    }

    const payload: LessonFormSubmitData = {
      ...data,
      ...(videoFile ? { video: videoFile } : {}),
    };
    await onSubmit(payload);
  };

  const previewSrc =
    videoPreviewUrl ?? (isEdit && existingVideoUrl ? existingVideoUrl : null);
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <FormField
        id="title"
        label="Title"
        error={errors.title?.message}
        required
      >
        <Input
          id="title"
          placeholder="Lesson title"
          {...register("title")}
          disabled={loading}
        />
      </FormField>

      <div className="space-y-3">
        <FormField
          id="video"
          label={isEdit ? "Replace video (optional)" : "Video"}
          error={videoError ?? undefined}
          required={!isEdit}
        >
          <input
            ref={fileInputRef}
            id="video"
            type="file"
            accept={ACCEPTED_VIDEO_TYPES}
            className="hidden"
            onChange={handleVideoChange}
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
            {videoFile ? videoFile.name : "Choose video from your device"}
          </Button>
        </FormField>

        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/80 p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
            Video preview
          </p>
          <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-lg border bg-black shadow-sm">
            <VideoPreview src={previewSrc} />
          </div>
        </div>
      </div>

      <FormField
        id="order"
        label="Order"
        error={errors.order?.message}
        required
      >
        <Input
          id="order"
          type="number"
          min={1}
          placeholder="1"
          {...register("order", { valueAsNumber: true })}
          disabled={loading}
        />
      </FormField>

      <Button type="submit" disabled={loading} className="w-full">
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
    </form>
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

function VideoPreview({ src }: { readonly src: string | null }) {
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setLoadFailed(false);
  }, [src]);

  if (!src || loadFailed) {
    return (
      <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 px-4 text-center text-gray-400">
        <Video className="h-10 w-10 stroke-[1.5]" />
        <p className="text-sm">
          {loadFailed
            ? "Could not load video. Try another file."
            : "Upload a video to see a preview"}
        </p>
      </div>
    );
  }

  return (
    <video
      key={src}
      src={src}
      controls
      className="h-full w-full object-contain"
      onError={() => setLoadFailed(true)}
    />
  );
}

function FormField({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
