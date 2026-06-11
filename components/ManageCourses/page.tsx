/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Search,
  X,
  ListVideo,
} from "lucide-react";
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
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Input } from "../ui/input";
import { PaginationC } from "../Pagination/page";

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<CourseProps[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.info("Please enter a search term");
      return;
    }
    setIsSearching(true);
    try {
      await fetchCourses({ title: searchTerm.trim() });
      toast.success("Search completed");
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed", {
        description: "Please try again later",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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

  const clearFilters = () => {
    setSearchTerm("");
    toast.info("Filters cleared");
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 pt-8 lg:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
            {courses?.length ? (
              <p className="text-gray-500 mt-1">
                Total {courses.length} courses in your platform
              </p>
            ) : (
              <Skeleton className="h-4 w-60 mt-3" />
            )}
          </div>
          <Button
            asChild
            className="bg-linear-to-r from-blue-600 to-purple-600"
          >
            <Link href="/admin/courses/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Link>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 transform text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search for courses... (e.g., Node.js, JavaScript)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-24 py-6 text-base border-gray-200 focus:border-blue-500"
          />
          <div className="flex flex-row-reverse justify-between absolute right-1 transform">
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
            {searchTerm && (
              <Button variant="ghost" onClick={clearFilters} size="default">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
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
