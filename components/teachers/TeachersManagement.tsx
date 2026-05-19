/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { TeacherForm } from "@/components/forms/teacher-form";
import { TeacherService } from "@/lib/services/data-service";
import { PageHeader } from "@/components/layout/page-header";
import type { Teacher } from "@/types";

export default function TeachersManagement() {
  const t = useTranslations();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  // Load teachers
  useEffect(() => {
    const loadTeachers = async () => {
      setLoading(true);
      try {
        const data = await TeacherService.getAll();
        setTeachers(data);
        setFilteredTeachers(data);
      } finally {
        setLoading(false);
      }
    };
    loadTeachers();
  }, []);

  // Filter by search term
  useEffect(() => {
    const filtered = teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setTimeout(() => {
      setFilteredTeachers(filtered);
    }, 100);
  }, [searchTerm, teachers]);

  // Handle add/edit
  const handleSubmit = async (data: Omit<Teacher, "id">) => {
    try {
      if (editingTeacher) {
        await TeacherService.update(editingTeacher.id, data);
      } else {
        await TeacherService.create(data);
      }
      // Reload teachers
      const updated = await TeacherService.getAll();
      setTeachers(updated);
      setIsDialogOpen(false);
      setEditingTeacher(null);
    } catch (error) {
      console.error("Error saving teacher:", error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingTeacher) return;
    try {
      await TeacherService.delete(deletingTeacher.id);
      const updated = await TeacherService.getAll();
      setTeachers(updated);
      setIsDeleteOpen(false);
      setDeletingTeacher(null);
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  const openEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (teacher: Teacher) => {
    setDeletingTeacher(teacher);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="শিক্ষক পরিচালনা"
        description="সকল শিক্ষক সদস্য পরিচালনা করুন এবং তাদের শ্রেণী বরাদ্দ নিয়ন্ত্রণ করুন"
        breadcrumbs={[
          { label: "ড্যাশবোর্ড", href: "/bn/dashboard" },
          { label: "শিক্ষক" },
        ]}
        action={
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            onClick={() => {
              setEditingTeacher(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            নতুন শিক্ষক
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <Input
          placeholder="শিক্ষক নাম, ইমেইল বা বিশেষত্ব অনুসন্ধান করুন..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">লোড হচ্ছে...</div>
        ) : filteredTeachers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            কোন শিক্ষক পাওয়া যায়নি
          </div>
        ) : (
          filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-400 to-pink-600" />
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    teacher.status === "active"
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                  }`}
                >
                  {teacher.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {teacher.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                {teacher.specialization}
              </p>
              <div className="space-y-2 text-sm mb-4">
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-medium">ইমেইল:</span> {teacher.email}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-medium">মোবাইল:</span> {teacher.phone}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-medium">ক্লাস:</span>{" "}
                  {teacher.classes.join(", ")}
                </p>
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(teacher)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  সম্পাদনা
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => openDeleteDialog(teacher)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  মুছুন
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTeacher ? "শিক্ষক সম্পাদনা করুন" : "নতুন শিক্ষক যোগ করুন"}
            </DialogTitle>
            <DialogDescription>
              {editingTeacher
                ? "শিক্ষকের তথ্য আপডেট করুন"
                : "নতুন শিক্ষক সদস্য সম্পর্কে তথ্য প্রবেশ করুন"}
            </DialogDescription>
          </DialogHeader>
          <TeacherForm
            initialData={editingTeacher || undefined}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>শিক্ষক মুছুন</AlertDialogTitle>
            <AlertDialogDescription>
              আপনি কি {deletingTeacher?.name} মুছতে নিশ্চিত? এই ক্রিয়া বাতিল
              করা যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              মুছুন
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
