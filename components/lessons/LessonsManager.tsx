"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SharedTable } from "@/components/shared/SharedTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { LessonForm } from "@/components/forms/LessonForm";
import { createLesson } from "@/actions/lessons/createLesson";
import { deleteLesson } from "@/actions/lessons/deleteLesson";
import { getLessons } from "@/actions/lessons/getLessons";
import { updateLesson } from "@/actions/lessons/updateLesson";
import { getCourse as getCourseData } from "@/actions/courses/getCourse";
import {
  Column,
  CourseProps,
  LessonProps,
  LessonsManagerProps,
} from "@/lib/types";
import { LessonFormSubmitData } from "@/lib/schemas/lesson.schema";

export function LessonsManager({ courseId }: LessonsManagerProps) {
  const [lessons, setLessons] = useState<LessonProps[]>([]);
  const [course, setCourse] = useState<CourseProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonProps | null>(
    null,
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lessonsData, course] = await Promise.all([
        getLessons(courseId),
        getCourseData(courseId),
      ]);
      setLessons(lessonsData);
      setCourse(course);
    } catch {
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const handleSubmit = async (data: LessonFormSubmitData) => {
    try {
      setSubmitting(true);
      if (selectedLesson) {
        await updateLesson(
          selectedLesson._id,
          { title: data.title, order: data.order },
          data.video,
        );
        toast.success("Lesson updated successfully");
      } else {
        if (!data.video) {
          toast.error("Please upload a video file");
          setSubmitting(false);
          return;
        }
        await createLesson(
          courseId,
          { title: data.title, order: data.order },
          data.video,
        );
        toast.success("Lesson created successfully");
      }
      setFormOpen(false);
      setSelectedLesson(null);
      await fetchData();
    } catch {
      toast.error(
        selectedLesson ? "Failed to update lesson" : "Failed to create lesson",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLesson) return;
    try {
      await deleteLesson(selectedLesson._id);
      toast.success("Lesson deleted successfully");
      setDeleteOpen(false);
      setSelectedLesson(null);
      await fetchData();
    } catch {
      toast.error("Failed to delete lesson");
    }
  };

  const columns: Column<LessonProps>[] = [
    { key: "title", title: "Title" },
    {
      key: "videoUrl",
      title: "Video URL",
      render: (lesson) => (
        <div className="flex items-center gap-2 max-w-xs">
          <span className="text-sm text-gray-600 truncate">
            {lesson.videoUrl}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 h-8 w-8 p-0"
            title="Copy video URL"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(lesson.videoUrl);
                toast.success("Video URL copied to clipboard");
              } catch {
                toast.error("Failed to copy video URL");
              }
            }}
          >
            <Copy className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      ),
    },
    { key: "order", title: "Order" },
    {
      key: "actions",
      title: "Actions",
      className: "text-right",
      render: (lesson) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedLesson(lesson);
              setFormOpen(true);
            }}
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedLesson(lesson);
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title={`Lessons — ${course?.title || "Course"}`}
        description="Add, edit, and manage course lessons"
        action={
          <Button
            onClick={() => {
              setSelectedLesson(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lesson
          </Button>
        }
      />

      <SharedTable
        title="Course Lessons"
        description="All lessons for this course"
        columns={columns}
        data={lessons}
        keyExtractor={(lesson) => lesson._id}
        loading={loading}
        emptyMessage="No lessons yet. Add your first lesson!"
        skeletonRows={4}
        skeletonColumns={4}
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedLesson ? "Edit Lesson" : "Add Lesson"}
            </DialogTitle>
            <DialogDescription>
              {selectedLesson
                ? "Update lesson details"
                : "Create a new lesson for this course"}
            </DialogDescription>
          </DialogHeader>
          <LessonForm
            course={
              course
                ? {
                    title: course.title,
                    description: course.description,
                    price: course.price,
                    image: course.image,
                  }
                : undefined
            }
            isEdit={!!selectedLesson}
            existingVideoUrl={selectedLesson?.videoUrl}
            defaultValues={
              selectedLesson
                ? {
                    title: selectedLesson.title,
                    order: selectedLesson.order,
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            loading={submitting}
            submitLabel={selectedLesson ? "Update Lesson" : "Add Lesson"}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lesson</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedLesson?.title}
              &quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
