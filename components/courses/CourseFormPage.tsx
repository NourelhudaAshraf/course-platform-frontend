"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { CourseForm } from "@/components/forms/CourseForm";
import { CourseFormPageProps } from "@/lib/types";
import {
  CourseFormData,
  CourseFormSubmitData,
} from "@/lib/schemas/course.schema";
import { createCourse } from "@/actions/courses/createCourse";
import { getCourse as getCourseData } from "@/actions/courses/getCourse";
import { updateCourse } from "@/actions/courses/updateCourse";

export function CourseFormPage({ courseId }: CourseFormPageProps) {
  const router = useRouter();
  const isEdit = Boolean(courseId);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [defaultValues, setDefaultValues] = useState<CourseFormData>();
  const [existingImageUrl, setExistingImageUrl] = useState<string>();

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      setFetching(true);
      const result = await getCourseData(courseId);
      if (result.success) {
        setDefaultValues({
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
        });
        setExistingImageUrl(result.data.image);
      } else {
        toast.error(result.error);
      }
      setFetching(false);
    };

    fetchCourse();
  }, [courseId]);

  const handleSubmit = async (data: CourseFormSubmitData) => {
    setLoading(true);
    if (isEdit && courseId) {
      const result = await updateCourse(
        courseId,
        {
          title: data.title,
          description: data.description,
          price: data.price,
        },
        data.image,
      );
      if (result.success) {
        toast.success("Course updated successfully");
        router.push(`/admin/courses/${courseId}/lessons`);
      } else {
        toast.error(result.error);
      }
    } else {
      if (!data.image) {
        toast.error("Please upload an image");
        setLoading(false);
        return;
      }
      const result = await createCourse(
        {
          title: data.title,
          description: data.description,
          price: data.price,
        },
        data.image,
      );
      if (result.success) {
        toast.success("Course created successfully");
        router.push(`/admin/courses/${result.data._id}/lessons`);
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
        title={isEdit ? "Edit Course" : "Create Course"}
        description={
          isEdit ? "Update course details" : "Add a new course to your platform"
        }
      />
      <CourseForm
        defaultValues={defaultValues}
        existingImageUrl={existingImageUrl}
        isEdit={isEdit}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={isEdit ? "Update Course" : "Create Course"}
      />
    </div>
  );
}

