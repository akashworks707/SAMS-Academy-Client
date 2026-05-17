/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { TableColumn, SearchFilters } from "@/types/admin";

interface AdminDataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  error?: string | null;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (filters: SearchFilters) => void;
  onSort?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  actionColumn?: (data: T) => React.ReactNode;
}

export function AdminDataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  error = null,
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onSearch,
  onSort,
  searchPlaceholder = "Search...",
  emptyMessage = "No records found",
  actionColumn,
}: AdminDataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.({ search: query, sortBy: sortBy || undefined, sortOrder });
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      const newOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newOrder);
      onSort?.(column, newOrder);
    } else {
      setSortBy(column);
      setSortOrder("asc");
      onSort?.(column, "asc");
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead key={String(column.accessor)} className={column.width}>
                  <button
                    onClick={() =>
                      column.sortable && handleSort(String(column.accessor))
                    }
                    className={cn(
                      "flex items-center gap-2",
                      column.sortable && "cursor-pointer hover:text-foreground"
                    )}
                  >
                    {column.header}
                    {column.sortable && (
                      <span className="text-xs">
                        {sortBy === column.accessor ? (
                          sortOrder === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-40" />
                        )}
                      </span>
                    )}
                  </button>
                </TableHead>
              ))}
              {actionColumn && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((col, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                    ))}
                    {actionColumn && (
                      <TableCell>
                        <Skeleton className="h-8 w-20" />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              : data.length === 0
                ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + (actionColumn ? 1 : 0)}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {emptyMessage}
                      </TableCell>
                    </TableRow>
                  )
                : data.map((row, idx) => (
                    <TableRow key={idx}>
                      {columns.map((column) => (
                        <TableCell key={String(column.accessor)}>
                          {column.cell
                            ? column.cell(row)
                            : String(row[column.accessor as keyof T] || "-")}
                        </TableCell>
                      ))}
                      {actionColumn && (
                        <TableCell>{actionColumn(row)}</TableCell>
                      )}
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} ({totalCount} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
