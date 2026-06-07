"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { CourseForm } from "@/components/forms/CourseForm";
import { CourseFormPageProps } from "@/lib/types";
import { CourseFormData } from "@/lib/schemas/course.schema";
import { createCourse } from "@/actions/courses/createCourse";
import { getCourse as getCourseData } from "@/actions/courses/getCourse";
import { updateCourse } from "@/actions/courses/updateCourse";

export function CourseFormPage({ courseId }: CourseFormPageProps) {
  const router = useRouter();
  const isEdit = Boolean(courseId);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [defaultValues, setDefaultValues] = useState<CourseFormData>();

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        setFetching(true);
        const course = await getCourseData(courseId);
        setDefaultValues({
          title: course.title,
          description: course.description,
          price: course.price,
          image: course.image,
        });
      } catch {
        toast.error("Failed to load course");
      } finally {
        setFetching(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleSubmit = async (data: CourseFormData) => {
    try {
      setLoading(true);
      if (isEdit && courseId) {
        await updateCourse(courseId, data);
        toast.success("Course updated successfully");
        router.push(`/admin/courses/${courseId}/lessons`);
      } else {
        const course = await createCourse(data);
        toast.success("Course created successfully");
        router.push(`/admin/courses/${course._id}/lessons`);
      }
    } catch {
      toast.error(isEdit ? "Failed to update course" : "Failed to create course");
    } finally {
      setLoading(false);
    }
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title={isEdit ? "Edit Course" : "Create Course"}
        description={
          isEdit
            ? "Update course details"
            : "Add a new course to your platform"
        }
      />
      <CourseForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={isEdit ? "Update Course" : "Create Course"}
      />
    </div>
  );
}
