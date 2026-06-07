import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationProps } from "@/lib/types";

export function PaginationC({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="my-5">
      <Pagination className="w-5/12">
        <PaginationContent className="w-full flex justify-between">
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className="text-base disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </PaginationItem>

          {/* Pages */}
          <div className="w-full flex gap-2 justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => onPageChange(page)}
                  className={`${
                    page === currentPage
                      ? "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:text-white"
                      : "hover:bg-gray-100 hover:text-black"
                  } text-base`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
          </div>

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              className="text-base"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
