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
import { StudentForm } from "@/components/forms/student-form";
import { StudentService } from "@/lib/services/data-service";
import { PageHeader } from "@/components/layout/page-header";
import type { Student } from "@/types";

export default function StudentsManagement() {
  const t = useTranslations();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // Load students
  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      try {
        const data = await StudentService.getAll();
        setStudents(data);
        setFilteredStudents(data);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  // Filter by search term
  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm),
    );
    setTimeout(() => {
      setFilteredStudents(filtered);
    }, 100);
  }, [searchTerm, students]);

  // Handle add/edit
  const handleSubmit = async (data: Omit<Student, "id">) => {
    try {
      if (editingStudent) {
        await StudentService.update(editingStudent.id, data);
      } else {
        await StudentService.create(data);
      }
      // Reload students
      const updated = await StudentService.getAll();
      setStudents(updated);
      setIsDialogOpen(false);
      setEditingStudent(null);
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingStudent) return;
    try {
      await StudentService.delete(deletingStudent.id);
      const updated = await StudentService.getAll();
      setStudents(updated);
      setIsDeleteOpen(false);
      setDeletingStudent(null);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (student: Student) => {
    setDeletingStudent(student);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="শিক্ষার্থী পরিচালনা"
        description="সকল শিক্ষার্থী তথ্য পরিচালনা করুন এবং তাদের রেজিস্ট্রেশন নিয়ন্ত্রণ করুন"
        breadcrumbs={[
          { label: "ড্যাশবোর্ড", href: "/bn/dashboard" },
          { label: "শিক্ষার্থী" },
        ]}
        action={
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            onClick={() => {
              setEditingStudent(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            নতুন শিক্ষার্থী
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <Input
          placeholder="শিক্ষার্থী নাম, ইমেইল বা ক্লাস অনুসন্ধান করুন..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">লোড হচ্ছে...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            কোন শিক্ষার্থী পাওয়া যায়নি
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-400 to-blue-600" />
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    student.status === "active"
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                  }`}
                >
                  {student.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {student.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                {student.class}
              </p>
              <div className="space-y-2 text-sm mb-4">
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-medium">ইমেইল:</span> {student.email}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-medium">মোবাইল:</span> {student.phone}
                </p>
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(student)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  সম্পাদনা
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => openDeleteDialog(student)}
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
              {editingStudent
                ? "শিক্ষার্থী সম্পাদনা করুন"
                : "নতুন শিক্ষার্থী যোগ করুন"}
            </DialogTitle>
            <DialogDescription>
              {editingStudent
                ? "শিক্ষার্থীর তথ্য আপডেট করুন"
                : "নতুন শিক্ষার্থী সম্পর্কে তথ্য প্রবেশ করুন"}
            </DialogDescription>
          </DialogHeader>
          <StudentForm
            initialData={editingStudent || undefined}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>শিক্ষার্থী মুছুন</AlertDialogTitle>
            <AlertDialogDescription>
              আপনি কি {deletingStudent?.name} মুছতে নিশ্চিত? এই ক্রিয়া বাতিল
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
