/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Edit, Trash2, Eye, BookOpen, ListVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SharedTable } from "../SharedTable/page";
import { deleteCourse } from "@/actions/courses/deleteCourse";
import { getCourses as getCoursesFromAPI } from "@/actions/courses/getCourses";
import { Column, CourseProps, SearchData } from "@/lib/types";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PaginationC } from "../Pagination/page";
import HeaderSearchSection from "./HeaderSearchSection/page";

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<CourseProps[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseProps | null>(
    null,
  );

  const fetchCourses = async (searchData?: SearchData) => {
    setLoading(true);
    const result = await getCoursesFromAPI(page, searchData);
    if (result.success) {
      setTotalPages(result.data.totalPages);
      setCourses(result.data.data);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, [page]);

  const handleDelete = async () => {
    if (!selectedCourse) return;

    const result = await deleteCourse(selectedCourse._id);
    if (result.success) {
      toast.success("Course deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedCourse(null);
    } else {
      toast.error(result.error);
    }
    await fetchCourses();
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const columns: Column<CourseProps>[] = [
    {
      key: "title",
      title: "Course",
      render: (course) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {course.image ? (
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <BookOpen className="h-5 w-5 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 line-clamp-1">
              {course.title}
            </p>
            <p className="text-xs text-gray-500">{course.user.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      title: "Price",
      render: (course) => (
        <span className="font-semibold text-gray-900">
          {course.price === 0 ? "Free" : formatCurrency(course.price)}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: () => (
        <Badge className={"bg-green-100 text-green-700"}>Published</Badge>
      ),
    },
    {
      key: "createdAt",
      title: "Created",
      minWidth: 150,
      render: (course) => (
        <span className="text-gray-500">{formatDate(course.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      className: "text-right",
      render: (course) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            title="View on Main Website"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/courses/${course._id}`);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Manage Lessons"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/courses/${course._id}/lessons`);
            }}
          >
            <ListVideo className="h-4 w-4 text-purple-600" />
          </Button>
          <Button
            variant="ghost"
            title="Edit Course"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/courses/edit/${course._id}`);
            }}
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Delete Course"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCourse(course);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 pt-8 lg:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-5">
        <HeaderSearchSection courses={courses} fetchCourses={fetchCourses} />
        <SharedTable
          title="All Courses"
          description="Manage your course catalog"
          columns={columns}
          data={courses}
          keyExtractor={(course) => course._id}
          loading={loading}
          emptyMessage="No courses found. Create your first course!"
          skeletonRows={5}
          skeletonColumns={6}
        />
        {totalPages > 1 && (
          <PaginationC
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Course</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{selectedCourse?.title}
                &quot;? <br />
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
