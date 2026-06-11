"use client";
import { useEffect, useState } from "react";
import SearchSection from "./Search/page";
import { CourseProps, SearchData } from "@/lib/types";
import CoursesSection from "./CoursesSection/page";
import { toast } from "sonner";
import { PaginationC } from "../Pagination/page";
import { getCourses as getCoursesFromAPI } from "@/actions/courses/getCourses";
import { SkeletonCard } from "../SkeletonCard/page";
import { LIMIT } from "@/lib/constants";

export default function Home() {
  const [coursesList, setCoursesList] = useState<CourseProps[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function getCourses(searchData?: SearchData | undefined) {
    setLoading(true);
    const result = await getCoursesFromAPI(page, searchData);
    if (result.success) {
      setCoursesList(result.data.data as CourseProps[]);
      setTotalPages(result.data.totalPages);
      setLoading(false);
      return result.data.results;
    }
    toast.error("Fetching failed", {
      description: result.error,
    });
    setLoading(false);
  }

  useEffect(() => {
    getCourses();
  }, [page]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <div className="min-h-dvh bg-linear-to-br from-blue-50 via-white to-purple-50 mb-10">
      <SearchSection getCourses={getCourses} />
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {Array.from({ length: LIMIT }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <CoursesSection coursesList={coursesList} />
      )}
      {totalPages > 1 && (
        <PaginationC
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
