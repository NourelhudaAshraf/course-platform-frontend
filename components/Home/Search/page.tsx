"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSectionProps } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import RangeSlider from "./RangeSlider/page";
import { Separator } from "@/components/ui/separator";
import FilterAndSort from "./FilterAndSort/page";

export default function SearchSection({ getCourses }: SearchSectionProps) {
  const [searchTitle, setSearchTitle] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState("price");

  const handleSearch = async () => {
    if (!searchTitle.trim() && priceRange[0] === 0 && priceRange[1] === 1000) {
      toast.info("Please enter a search term or adjust price filter");
      return;
    }
    setIsSearching(true);
    const searchData = {
      title: searchTitle.trim(),
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy: {
        price: sortBy,
      },
    };
    try {
      const results = await getCourses?.(searchData);
      toast.success(`Found ${results ?? 0} courses`);
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
    setSearchTitle("");
    setPriceRange([0, 1000]);
    setSortBy("price");
    toast.info("Filters cleared");
    getCourses?.();
  };

  return (
    <section className="w-full py-12 px-0 sm:px-4 bg-linear-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto w-[90%] sm:w-[75%]">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Search For a Course
          </h2>
          <p className="text-gray-600">
            Search by course title and filter by price
          </p>
        </div>

        {/* Main Search Card */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-6 pb-0">
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 transform text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for courses... (e.g., Node.js, JavaScript)"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-24 py-6 text-base border-gray-200 focus:border-blue-500"
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="absolute right-1 transform bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Filter Toggle Button and Sort */}
            <FilterAndSort
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* Price Filter - Only Filter Available */}
            {showFilters && (
              <RangeSlider
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            )}
            {(searchTitle ||
              priceRange[0] > 0 ||
              priceRange[1] < 1000 ||
              sortBy !== "price") && (
              <>
                <Separator className="my-4 " />
                <div className="flex justify-end w-full">
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    size="default"
                    className="text-red-600 hover:text-red-700 text-base"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
