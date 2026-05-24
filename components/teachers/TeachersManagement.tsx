"use client";

import React, { useState } from "react";
import { Edit2, Trash2, Search, GraduationCap, Users, Eye } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";

import { useGetAllTeachersQuery, useDeleteUserMutation } from "@/redux/features/user/user.api";
import { CreateTeacherModal } from "./CreateTeacherModal";
import { UpdateTeacherModal } from "./UpdateTeacherModal";
import { TeacherDetailsModal } from "./TeacherDetailsModal";

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

function TeacherCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function TeacherManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTeacher, setEditingTeacher] = useState<any | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [viewingTeacher, setViewingTeacher] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deletingTeacher, setDeletingTeacher] = useState<any | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading, refetch } = useGetAllTeachersQuery(
    searchTerm ? { searchTerm } : undefined
  );
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const teachers: any[] = data?.data ?? [];

  const openEditDialog = (teacher: any) => {
    setEditingTeacher(teacher);
    setIsUpdateOpen(true);
  };

  const openDetailsDialog = (teacher: any) => {
    setViewingTeacher(teacher);
    setIsDetailsOpen(true);
  };

  const openDeleteDialog = (teacher: any) => {
    setDeletingTeacher(teacher);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingTeacher) return;
    try {
      await deleteUser(deletingTeacher._id).unwrap();
      toast.success("শিক্ষক সফলভাবে মুছে ফেলা হয়েছে");
      setIsDeleteOpen(false);
      setDeletingTeacher(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "মুছতে ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="শিক্ষক পরিচালনা"
        description="সকল শিক্ষক সদস্য পরিচালনা করুন এবং তাদের তথ্য নিয়ন্ত্রণ করুন"
        breadcrumbs={[
          { label: "ড্যাশবোর্ড", href: "/dashboard" },
          { label: "শিক্ষক পরিচালনা" },
        ]}
        action={<CreateTeacherModal onSuccess={refetch} />}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">মোট শিক্ষক</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {isLoading ? "—" : data?.meta?.total ?? teachers.length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-violet-500 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">মোট পাতা</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {isLoading ? "—" : data?.meta?.totalPage ?? 1}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="নাম, ইমেইল বা পদবী দিয়ে অনুসন্ধান করুন..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <TeacherCardSkeleton key={i} />)
        ) : teachers.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
            <GraduationCap className="w-12 h-12 mb-4 opacity-30" />
            {searchTerm ? (
              <>
                <p className="text-base font-medium">কোনো ফলাফল পাওয়া যায়নি</p>
                <p className="text-sm mt-1">&quot;{searchTerm}&quot; দিয়ে কোনো শিক্ষক খুঁজে পাওয়া যায়নি</p>
              </>
            ) : (
              <>
                <p className="text-base font-medium">কোনো শিক্ষক যোগ করা হয়নি</p>
                <p className="text-sm mt-1">নতুন শিক্ষক বাটনে ক্লিক করে শুরু করুন</p>
              </>
            )}
          </div>
        ) : (
          teachers.map((teacher) => {
            teacher
            const profileId = teacher._id;
            const address = teacher.address;
            const hasAddress = address && (address.division || address.district || address.thana || address.union);

            return (
              <div
                key={profileId}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  {teacher?.picture ? (
                    <img
                      src={teacher.picture}
                      alt={teacher.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {teacher?.name?.charAt(0)?.toUpperCase() ?? "T"}
                    </div>
                  )}
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                  >
                    <span className="h-1.5 w-1.5 rounded-full mr-1.5 inline-block bg-emerald-500" />
                    সক্রিয়
                  </Badge>
                </div>

                {/* Name + Designation */}
                <h3 className="font-semibold text-slate-900 dark:text-white mb-0.5 truncate">
                  {teacher?.name ?? "—"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {teacher.designation ?? "শিক্ষক"}
                </p>

                {/* Details */}
                <div className="space-y-1.5 text-sm mb-4 flex-1">
                  <p className="text-slate-600 dark:text-slate-400 truncate">
                    <span className="font-medium">ইমেইল:</span> {teacher?.email ?? "—"}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-medium">মোবাইল:</span> {teacher?.phone ?? "—"}
                  </p>
                  {teacher.qualification && (
                    <p className="text-slate-600 dark:text-slate-400 truncate">
                      <span className="font-medium">যোগ্যতা:</span> {teacher.qualification}
                    </p>
                  )}
                  {teacher.experience > 0 && (
                    <p className="text-slate-600 dark:text-slate-400">
                      <span className="font-medium">অভিজ্ঞতা:</span> {teacher.experience} বছর
                    </p>
                  )}
                  {hasAddress && (
                    <p className="text-slate-600 dark:text-slate-400 truncate">
                      <span className="font-medium">ঠিকানা:</span>{" "}
                      {[address.thana, address.district].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(teacher)}
                  >
                    <Edit2 className="w-4 h-4 mr-1.5" />
                    সম্পাদনা
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3"
                    title="বিস্তারিত দেখুন"
                    onClick={() => openDetailsDialog(teacher)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="px-3"
                    title="মুছুন"
                    onClick={() => openDeleteDialog(teacher)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Update Modal */}
      {editingTeacher && (
        <UpdateTeacherModal
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          item={editingTeacher}
          onSuccess={refetch}
        />
      )}

      {/* Details Modal */}
      {viewingTeacher && (
        <TeacherDetailsModal
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          item={viewingTeacher}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>শিক্ষক মুছুন</AlertDialogTitle>
            <AlertDialogDescription>
              আপনি কি <strong>{deletingTeacher?.userId?.name}</strong> কে মুছে ফেলতে
              নিশ্চিত? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel disabled={isDeleting}>বাতিল করুন</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "মুছছে..." : "মুছুন"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}