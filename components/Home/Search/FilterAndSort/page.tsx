import { Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterAndSortProps } from "@/lib/types";

export default function FilterAndSort({
  showFilters,
  setShowFilters,
  sortBy,
  setSortBy,
}: FilterAndSortProps) {
  return (
    <div className="flex flex-col-reverse items-end sm:flex-row sm:justify-between sm:items-center gap-3 mt-4 ">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
          className="text-gray-600"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-between">
              <span className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                {sortBy === "price"
                  ? "Price: Low to High ↑"
                  : "Price: High to Low ↓"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem onClick={() => setSortBy("price")}>
              Price: Low to High ↑
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("-price")}>
              Price: High to Low ↓
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
