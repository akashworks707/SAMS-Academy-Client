/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, BookOpen } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import {
  useGetSubjectsQuery,
  useSoftDeleteSubjectMutation,
} from "@/redux/features/subjects/subject.api";
import CreateSubjectModal from "./CreateSubjectModal";
import UpdateSubjectModal from "./UpdateSubjectModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubjectItem {
  _id: string;
  title: string;
  code?: string;
  description?: string;
  isActive: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SubjectsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState<SubjectItem | null>(null);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // ── RTK Query ──
  const {
    data: subjectsData,
    isLoading: isSubjectsLoading,
    refetch,
  } = useGetSubjectsQuery({
    searchTerm: searchTerm || undefined,
    limit: 50,
  });

  const [softDeleteSubject, { isLoading: isDeleting }] = useSoftDeleteSubjectMutation();

  const subjects = (subjectsData as { data?: SubjectItem[] })?.data ?? [];

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openEditDialog = (subject: SubjectItem) => {
    setEditingSubject(subject);
    setIsEditOpen(true);
  };

  const handleDeleteSubject = async () => {
    if (!deletingSubject) return;
    try {
      await softDeleteSubject(deletingSubject._id).unwrap();
      toast.success("Subject removed", {
        description: `"${deletingSubject.title}" has been moved to trash.`,
      });
      setIsDeleteOpen(false);
      setDeletingSubject(null);
      refetch();
    } catch (error: any) {
      toast.error("Delete failed", {
        description: error?.data?.message ?? "There was a problem deleting the subject.",
      });
    }
  };

  const openDeleteDialog = (subject: SubjectItem) => {
    setDeletingSubject(subject);
    setIsDeleteOpen(true);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects Management"
        description="Manage all subjects and curricula"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Subjects" },
        ]}
        action={<CreateSubjectModal onSuccess={refetch} />}
      />

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by name or code..."
          className="pl-9 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isSubjectsLoading ? (
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
        ) : subjects.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
            <BookOpen className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">No subjects found</p>
            <p className="text-sm mt-1">
              {searchTerm
                ? "Try searching with a different keyword"
                : "Create your first subject to get started"}
            </p>
          </div>
        ) : (
          subjects.map((subject) => (
            <div
              key={subject._id}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                  {subject.title.charAt(0).toUpperCase()}
                </div>
                <Badge
                  className={
                    subject.isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }
                >
                  {subject.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <h3 className="font-semibold text-slate-900 dark:text-white mb-0.5 truncate">
                {subject.title}
              </h3>

              {subject.code && (
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
                  {subject.code}
                </p>
              )}

              {subject.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {subject.description}
                </p>
              )}

              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8"
                  onClick={() => openEditDialog(subject)}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                  onClick={() => openDeleteDialog(subject)}
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
      {editingSubject && (
        <UpdateSubjectModal
          subject={editingSubject}
          open={isEditOpen}
          onOpenChange={(val) => {
            setIsEditOpen(val);
            if (!val) setEditingSubject(null);
          }}
          onSuccess={refetch}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {deletingSubject?.title}
              </span>
              ? It will be moved to trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubject}
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