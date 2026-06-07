"use client";
import { LIMIT } from "@/lib/constants";
import { PaginationC } from "../Pagination/page";
import { SkeletonCard } from "../SkeletonCard/page";
import CourseCard from "../CourseCard/page";
import { useEffect, useState } from "react";
import { EnrollProps } from "@/lib/types";
import { getEnrolledCourses } from "@/actions/enroll";
import { toast } from "sonner";
import { ChevronRight, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";

export default function MyCourses() {
  const [coursesList, setCoursesList] = useState<EnrollProps[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function getCourses() {
    try {
      setLoading(true);
      const data = await getEnrolledCourses();
      setCoursesList(data.data as EnrollProps[]);
      setTotalPages(data.totalPages);
      return data.results;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error("Fetching failed", {
        description: error.message as string,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCourses();
  }, [page]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };
  return (
    <div className="relative min-h-dvh bg-linear-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Header Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          {/* Title Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-400/20 text-blue-600 border-blue-400/30 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-1" />
                My Learning Space
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600  to-purple-600 bg-clip-text text-transparent mb-3">
              Welcome back!
            </h1>
            <p className="text-gray-600 text-base max-w-2xl">
              Track your progress and continue your learning journey
            </p>
          </div>

          {/* Browse More Courses Button */}
          <Button
            variant="secondary"
            className="absolute right-1 transform bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            asChild
          >
            <Link href="/">
              Explore New Courses
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 py-4 px-2">
            {Array.from({ length: LIMIT }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <>
            {coursesList?.length ? (
              <div className="max-w-7xl mx-auto px-4 py-4" id="courses">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesList?.map((enroll: EnrollProps) => (
                    <CourseCard
                      key={enroll.course._id}
                      course={enroll.course}
                      showPrice={false}
                      buttonTitle="Go to Course"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center min-h-dvh">
                <p className="mx-auto text-xl text-gray-600">No courses yet!</p>
              </div>
            )}
          </>
        )}
        {totalPages > 1 && (
          <PaginationC
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
