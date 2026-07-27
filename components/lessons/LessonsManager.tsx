"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { deleteLesson } from "@/actions/lessons/deleteLesson";
import { getLessons } from "@/actions/lessons/getLessons";
import { getCourse as getCourseData } from "@/actions/courses/getCourse";
import {
  Column,
  CourseProps,
  LessonProps,
  LessonsManagerProps,
} from "@/lib/types";

export function LessonsManager({ courseId }: LessonsManagerProps) {
  const [lessons, setLessons] = useState<LessonProps[]>([]);
  const [course, setCourse] = useState<CourseProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonProps | null>(
    null,
  );

  const fetchData = async () => {
    setLoading(true);
    const [lessonsResult, courseResult] = await Promise.all([
      getLessons(courseId),
      getCourseData(courseId),
    ]);
    if (!lessonsResult.success) {
      toast.error(lessonsResult.error);
    } else if (!courseResult.success) {
      toast.error(courseResult.error);
    } else {
      setLessons(lessonsResult.data);
      setCourse(courseResult.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const handleDelete = async () => {
    if (!selectedLesson) return;
    const result = await deleteLesson(courseId, selectedLesson._id);
    if (result.success) {
      toast.success("Lesson deleted successfully");
      setDeleteOpen(false);
      setSelectedLesson(null);
      await fetchData();
    } else {
      toast.error(result.error);
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
          <Button variant="ghost" size="sm" asChild>
            <Link
              href={`/admin/courses/${courseId}/lessons/edit/${lesson._id}`}
            >
              <Edit className="h-4 w-4 text-blue-600" />
            </Link>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 mt-5 md:mt-0">
      <PageHeader
        title={`Lessons — ${course?.title || "Course"}`}
        description="Add, edit, and manage course lessons"
        action={
          <Button asChild>
            <Link href={`/admin/courses/${courseId}/lessons/create`}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </Link>
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
