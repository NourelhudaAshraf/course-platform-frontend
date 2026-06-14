"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { LessonForm } from "@/components/forms/LessonForm";
import { LessonFormPageProps } from "@/lib/types";
import {
  LessonFormData,
  LessonFormSubmitData,
} from "@/lib/schemas/lesson.schema";
import { createLesson } from "@/actions/lessons/createLesson";
import { getLesson } from "@/actions/lessons/getLesson";
import { updateLesson } from "@/actions/lessons/updateLesson";

export function LessonFormPage({ courseId, lessonId }: LessonFormPageProps) {
  const router = useRouter();
  const isEdit = Boolean(lessonId);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [defaultValues, setDefaultValues] = useState<LessonFormData>();
  const [existingVideoUrl, setExistingVideoUrl] = useState<string>();

  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      setFetching(true);
      const result = await getLesson(lessonId);
      if (result.success) {
        setDefaultValues({
          title: result.data.title,
          description: result.data.description ?? "",
          order: result.data.order,
        });
        setExistingVideoUrl(result.data.videoUrl);
      } else {
        toast.error(result.error);
      }
      setFetching(false);
    };

    fetchLesson();
  }, [lessonId]);

  const handleSubmit = async (data: LessonFormSubmitData) => {
    setLoading(true);
    if (isEdit && lessonId) {
      const result = await updateLesson(
        lessonId,
        {
          title: data.title,
          description: data.description,
          order: data.order,
        },
        data.video,
      );
      if (result.success) {
        toast.success("Lesson updated successfully");
        router.push(`/admin/courses/${courseId}/lessons`);
      } else {
        toast.error(result.error);
      }
    } else {
      if (!data.video) {
        toast.error("Please upload a video file");
        setLoading(false);
        return;
      }
      const result = await createLesson(
        courseId,
        {
          title: data.title,
          description: data.description,
          order: data.order,
        },
        data.video,
      );
      if (result.success) {
        toast.success("Lesson created successfully");
        router.push(`/admin/courses/${courseId}/lessons`);
      } else {
        toast.error(result.error);
      }
    }
    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 mt-5 md:mt-0">
      <PageHeader
        title={isEdit ? "Edit Lesson" : "Add Lesson"}
        description={
          isEdit
            ? "Update lesson details"
            : "Create a new lesson for this course"
        }
      />
      <LessonForm
        defaultValues={defaultValues}
        existingVideoUrl={existingVideoUrl}
        isEdit={isEdit}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={isEdit ? "Update Lesson" : "Add Lesson"}
      />
    </div>
  );
}
