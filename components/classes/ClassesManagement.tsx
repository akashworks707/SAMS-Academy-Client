/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { BookOpen, Users, UserCheck, Layers, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatCard } from "@/components/cards/stat-card";
import { PageHeader } from "@/components/layout/page-header";

import {
  useGetClassesQuery,
  useSoftDeleteClassMutation,
} from "@/redux/features/class/class.api";
import CreateClassModal from "./CreateClassModal";
import UpdateClassModal from "./UpdateClassModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClassItem {
  _id: string;
  title: string;
  description?: string;
  isActive: boolean;
}

// ─── Static Stats ─────────────────────────────────────────────────────────────

const stats = [
  {
    title: "Total Classes",
    value: 56,
    icon: <BookOpen className="w-6 h-6" />,
    trend: 8.3,
    trendDirection: "up" as const,
    color: "blue" as const,
    description: "Active classes",
  },
  {
    title: "Active Learning Modules",
    value: 48,
    icon: <Layers className="w-6 h-6" />,
    trend: 5.7,
    trendDirection: "up" as const,
    color: "green" as const,
    description: "Learning modules",
  },
  {
    title: "Total Enrolled Students",
    value: 1245,
    icon: <Users className="w-6 h-6" />,
    trend: 12.5,
    trendDirection: "up" as const,
    color: "purple" as const,
    description: "Across all classes",
  },
  {
    title: "Average Class Size",
    value: 25,
    icon: <UserCheck className="w-6 h-6" />,
    trend: 3.2,
    trendDirection: "up" as const,
    color: "orange" as const,
    description: "Students per class",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ClassesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingClass, setDeletingClass] = useState<ClassItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ── RTK Query ──
  const {
    data: classesData,
    isLoading,
    refetch,
  } = useGetClassesQuery({
    searchTerm: searchTerm || undefined,
    limit: 50,
  });

  const [softDeleteClass, { isLoading: isDeleting }] = useSoftDeleteClassMutation();

  const classes = (classesData as { data?: ClassItem[] })?.data ?? [];

  // ── Filtered by search (client-side fallback) ──
  const filtered = classes.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openEditDialog = (classItem: ClassItem) => {
    setEditingClass(classItem);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (classItem: ClassItem) => {
    setDeletingClass(classItem);
    setIsDeleteOpen(true);
  };

  const handleDeleteClass = async () => {
    if (!deletingClass) return;
    try {
      await softDeleteClass(deletingClass._id).unwrap();
      toast.success("Class removed", {
        description: `"${deletingClass.title}" has been moved to trash.`,
      });
      setIsDeleteOpen(false);
      setDeletingClass(null);
      refetch();
    } catch (error: any) {
      toast.error("Delete failed", {
        description: error?.data?.message ?? "There was a problem deleting the class.",
      });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Classes Management"
        description="Manage all classes and learning modules"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Classes" },
        ]}
        action={<CreateClassModal onSuccess={refetch} />}
      />

      {/* Stat Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
            trendDirection={card.trendDirection}
            color={card.color}
            description={card.description}
          />
        ))}
      </div> */}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by class name..."
          className="pl-9 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700" />
                <div className="w-16 h-5 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4" />
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mt-4" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
            <BookOpen className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">No classes found</p>
            <p className="text-sm mt-1">
              {searchTerm
                ? "Try searching with a different keyword"
                : "Create your first class to get started"}
            </p>
          </div>
        ) : (
          filtered.map((classItem) => (
            <div
              key={classItem._id}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center font-bold text-green-600 dark:text-green-400 text-lg">
                  {classItem.title.charAt(0).toUpperCase()}
                </div>
                <Badge
                  className={
                    classItem.isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }
                >
                  <span className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${classItem.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                  {classItem.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <h3 className="font-semibold text-slate-900 dark:text-white mb-0.5 truncate">
                {classItem.title}
              </h3>

              {classItem.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {classItem.description}
                </p>
              )}

              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8"
                  onClick={() => openEditDialog(classItem)}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                  onClick={() => openDeleteDialog(classItem)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Update Modal */}
      {editingClass && (
        <UpdateClassModal
          classItem={editingClass}
          open={isEditOpen}
          onOpenChange={(val) => {
            setIsEditOpen(val);
            if (!val) setEditingClass(null);
          }}
          onSuccess={refetch}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {deletingClass?.title}
              </span>
              ? It will be moved to trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClass}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}