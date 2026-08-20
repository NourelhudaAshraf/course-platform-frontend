"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CourseProps, SearchData } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader/page";

export default function HeaderSearchSection({
  courses,
  fetchCourses,
}: {
  readonly courses: CourseProps[];
  readonly fetchCourses: (searchData?: SearchData) => Promise<void>;
}) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const clearFilters = () => {
    setSearchTerm("");
    toast.info("Filters cleared");
    fetchCourses();
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <PageHeader
          title="Manage Courses"
          description={`You can manage all courses in the platform`}
        />
        <Button asChild className="bg-linear-to-r from-blue-600 to-purple-600">
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
    </>
  );
}
