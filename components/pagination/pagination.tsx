"use client";

import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPage: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPage,
  onPageChange,
}: PaginationProps) {
  if (totalPage <= 1) return null;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPage) onPageChange(page + 1);
  };

  const pages = Array.from({ length: totalPage }).slice(0, 5);

  return (
    <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
      
      {/* Info */}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Page{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {page}
        </span>{" "}
        of {totalPage}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={page === 1}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((_, i) => {
            const pageNum = i + 1;

            return (
              <Button
                key={pageNum}
                size="sm"
                variant={pageNum === page ? "default" : "outline"}
                className="w-9"
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={page === totalPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}