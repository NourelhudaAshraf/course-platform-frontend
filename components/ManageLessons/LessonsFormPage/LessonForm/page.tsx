"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormField from "@/components/FormField/page";
import { LessonFormComponentProps } from "@/lib/types";
import {
  lessonSchema,
  LessonFormData,
  LessonFormSubmitData,
} from "@/lib/schemas/lesson.schema";
import VideoPreview from "./VideoPreview/page";

const ACCEPTED_VIDEO_TYPES = "video/mp4,video/webm,video/ogg,video/quicktime";

export function LessonForm({
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
      description: "",
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
      <FormField
        id="description"
        label="Description"
        error={errors.description?.message}
        required
      >
        <textarea
          id="description"
          placeholder="Lesson description"
          rows={4}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          {...register("description")}
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

        <VideoPreview src={previewSrc} />
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
