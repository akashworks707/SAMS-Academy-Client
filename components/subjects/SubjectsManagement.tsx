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
import { SubjectForm } from "@/components/forms/subject-form";
import { SubjectService } from "@/lib/services/data-service";
import { PageHeader } from "@/components/layout/page-header";
import type { Subject } from "@/types";

export default function SubjectsManagement() {
  const t = useTranslations();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  // Load subjects
  useEffect(() => {
    const loadSubjects = async () => {
      setLoading(true);
      try {
        const data = await SubjectService.getAll();
        setSubjects(data);
        setFilteredSubjects(data);
      } finally {
        setLoading(false);
      }
    };
    loadSubjects();
  }, []);

  // Filter by search term
  useEffect(() => {
    const filtered = subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setTimeout(() => {
      setFilteredSubjects(filtered);
    }, 100);
  }, [searchTerm, subjects]);

  // Handle add/edit
  const handleSubmit = async (data: Omit<Subject, "id">) => {
    try {
      if (editingSubject) {
        await SubjectService.update(editingSubject.id, data);
      } else {
        await SubjectService.create(data);
      }
      // Reload subjects
      const updated = await SubjectService.getAll();
      setSubjects(updated);
      setIsDialogOpen(false);
      setEditingSubject(null);
    } catch (error) {
      console.error("Error saving subject:", error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingSubject) return;
    try {
      await SubjectService.delete(deletingSubject.id);
      const updated = await SubjectService.getAll();
      setSubjects(updated);
      setIsDeleteOpen(false);
      setDeletingSubject(null);
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (subject: Subject) => {
    setDeletingSubject(subject);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="বিষয় পরিচালনা"
        description="সকল বিষয় এবং পাঠ্যক্রম পরিচালনা করুন"
        breadcrumbs={[
          { label: "ড্যাশবোর্ড", href: "/bn/dashboard" },
          { label: "বিষয়" },
        ]}
        action={
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            onClick={() => {
              setEditingSubject(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            নতুন বিষয়
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <Input
          placeholder="বিষয় নাম বা কোড অনুসন্ধান করুন..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">লোড হচ্ছে...</div>
        ) : filteredSubjects.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            কোন বিষয় পাওয়া যায়নি
          </div>
        ) : (
          filteredSubjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                  {subject.name.charAt(0)}
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    subject.status === "active"
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                  }`}
                >
                  {subject.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {subject.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {subject.code}
              </p>
              <div className="space-y-2 text-sm mb-4">
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-medium">ক্রেডিট:</span>{" "}
                  {subject.creditHours}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-medium">ক্লাস:</span>{" "}
                  {subject.classes.join(", ")}
                </p>
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(subject)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  সম্পাদনা
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => openDeleteDialog(subject)}
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
              {editingSubject ? "বিষয় সম্পাদনা করুন" : "নতুন বিষয় যোগ করুন"}
            </DialogTitle>
            <DialogDescription>
              {editingSubject
                ? "বিষয়ের তথ্য আপডেট করুন"
                : "নতুন বিষয় সম্পর্কে তথ্য প্রবেশ করুন"}
            </DialogDescription>
          </DialogHeader>
          <SubjectForm
            initialData={editingSubject || undefined}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>বিষয় মুছুন</AlertDialogTitle>
            <AlertDialogDescription>
              আপনি কি {deletingSubject?.name} মুছতে নিশ্চিত? এই ক্রিয়া বাতিল
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
