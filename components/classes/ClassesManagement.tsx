// 'use client'

// import React from 'react'
// import { useTranslations } from 'next-intl'
// import { Plus, BookOpen, Users, UserCheck, Layers } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { StatCard } from '@/components/cards/stat-card'
// import { DataTable } from '@/components/table/data-table'
// import { dummyClasses } from '@/lib/dummy-data'
// import type { Class } from '@/types'

// const Breadcrumb = ({ items }: { items: Array<{ label: string; href?: string }> }) => {
//   return (
//     <nav className="flex items-center gap-2 mb-6">
//       {items.map((item, index) => (
//         <div key={index} className="flex items-center gap-2">
//           <a
//             href={item.href}
//             className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
//           >
//             {item.label}
//           </a>
//           {index < items.length - 1 && (
//             <span className="text-slate-400 dark:text-slate-600">&gt;</span>
//           )}
//         </div>
//       ))}
//     </nav>
//   )
// }

// export default function ClassesManagement() {
//   const t = useTranslations()

//   const stats = [
//     {
//       title: t('total_classes'),
//       value: 56,
//       icon: <BookOpen className="w-6 h-6" />,
//       trend: 8.3,
//       trendDirection: 'up' as const,
//       color: 'blue' as const,
//       description: 'সক্রিয় ক্লাস',
//     },
//     {
//       title: 'সক্রিয় শিক্ষা মডিউল',
//       value: 48,
//       icon: <Layers className="w-6 h-6" />,
//       trend: 5.7,
//       trendDirection: 'up' as const,
//       color: 'green' as const,
//       description: 'শিক্ষা মডিউল',
//     },
//     {
//       title: 'মোট ভর্তিকৃত ছাত্র',
//       value: 1245,
//       icon: <Users className="w-6 h-6" />,
//       trend: 12.5,
//       trendDirection: 'up' as const,
//       color: 'purple' as const,
//       description: 'সকল ক্লাসে',
//     },
//     {
//       title: 'গড় ক্লাস সাইজ',
//       value: 25,
//       icon: <UserCheck className="w-6 h-6" />,
//       trend: 3.2,
//       trendDirection: 'up' as const,
//       color: 'orange' as const,
//       description: 'ছাত্র প্রতি ক্লাসে',
//     },
//   ]

//   const columns = [
//     {
//       key: 'code' as const,
//       label: 'ক্লাস কোড',
//       width: 'w-20',
//     },
//     {
//       key: 'name' as const,
//       label: 'ক্লাসের নাম',
//     },
//     {
//       key: 'classTeacher' as const,
//       label: 'ক্লাস শিক্ষক',
//     },
//     {
//       key: 'totalStudents' as const,
//       label: 'মোট ছাত্র',
//       render: (value: number) => (
//         <span className="font-semibold text-slate-900 dark:text-white">{value}</span>
//       ),
//     },
//     {
//       key: 'grade' as const,
//       label: 'গ্রেড',
//     },
//     {
//       key: 'status' as const,
//       label: 'অবস্থা',
//       render: (value: string) => (
//         <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
//           {value === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
//         </span>
//       ),
//     },
//   ]

//   const handleView = (row: Class) => {
//     console.log('View:', row)
//   }

//   const handleEdit = (row: Class) => {
//     console.log('Edit:', row)
//   }

//   const handleDelete = (row: Class) => {
//     console.log('Delete:', row)
//   }

//   return (
//     <div className="space-y-6">
//       {/* Breadcrumb */}
//       <Breadcrumb
//         items={[
//           { label: 'ড্যাশবোর্ড', href: '/dashboard' },
//           { label: 'ক্লাস' },
//         ]}
//       />

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
//             {t('classes')}
//           </h1>
//           <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
//             সকল ক্লাস এবং শিক্ষা মডিউল পরিচালনা করুন
//           </p>
//         </div>
//         <Button className="bg-green-600 hover:bg-green-700 text-white">
//           <Plus className="w-4 h-4 mr-2" />
//           {t('add_new_class')}
//         </Button>
//       </div>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((card, index) => (
//           <StatCard
//             key={index}
//             title={card.title}
//             value={card.value}
//             icon={card.icon}
//             trend={card.trend}
//             trendDirection={card.trendDirection}
//             color={card.color}
//             description={card.description}
//           />
//         ))}
//       </div>

//       {/* Data Table */}
//       <DataTable
//         columns={columns}
//         data={dummyClasses}
//         pageSize={10}
//         title="সকল ক্লাস"
//         searchable={true}
//         searchKey="name"
//         onView={handleView}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//       />
//     </div>
//   )
// }



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
    title: "মোট ক্লাস",
    value: 56,
    icon: <BookOpen className="w-6 h-6" />,
    trend: 8.3,
    trendDirection: "up" as const,
    color: "blue" as const,
    description: "সক্রিয় ক্লাস",
  },
  {
    title: "সক্রিয় শিক্ষা মডিউল",
    value: 48,
    icon: <Layers className="w-6 h-6" />,
    trend: 5.7,
    trendDirection: "up" as const,
    color: "green" as const,
    description: "শিক্ষা মডিউল",
  },
  {
    title: "মোট ভর্তিকৃত ছাত্র",
    value: 1245,
    icon: <Users className="w-6 h-6" />,
    trend: 12.5,
    trendDirection: "up" as const,
    color: "purple" as const,
    description: "সকল ক্লাসে",
  },
  {
    title: "গড় ক্লাস সাইজ",
    value: 25,
    icon: <UserCheck className="w-6 h-6" />,
    trend: 3.2,
    trendDirection: "up" as const,
    color: "orange" as const,
    description: "ছাত্র প্রতি ক্লাসে",
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
      toast.success("ক্লাস সরানো হয়েছে", {
        description: `"${deletingClass.title}" ট্র্যাশে সরানো হয়েছে।`,
      });
      setIsDeleteOpen(false);
      setDeletingClass(null);
      refetch();
    } catch (error: any) {
      toast.error("মুছে ফেলা ব্যর্থ হয়েছে", {
        description: error?.data?.message ?? "ক্লাসটি মুছতে সমস্যা হয়েছে।",
      });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="ক্লাস পরিচালনা"
        description="সকল ক্লাস এবং শিক্ষা মডিউল পরিচালনা করুন"
        breadcrumbs={[
          { label: "ড্যাশবোর্ড", href: "/dashboard" },
          { label: "ক্লাস" },
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

      {/* অনুসন্ধান বার */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="ক্লাসের নাম দিয়ে অনুসন্ধান করুন..."
          className="pl-9 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ক্লাস গ্রিড */}
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
            <p className="font-medium">কোনো ক্লাস পাওয়া যায়নি</p>
            <p className="text-sm mt-1">
              {searchTerm
                ? "অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন"
                : "শুরু করতে প্রথম ক্লাসটি তৈরি করুন"}
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
                  {classItem.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
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
                  সম্পাদনা
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                  onClick={() => openDeleteDialog(classItem)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  মুছুন
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* আপডেট মডাল */}
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

      {/* মুছে ফেলার নিশ্চিতকরণ */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ক্লাস মুছুন</AlertDialogTitle>
            <AlertDialogDescription>
              আপনি কি{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {deletingClass?.title}
              </span>{" "}
              মুছতে নিশ্চিত? এটি ট্র্যাশে সরানো হবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <AlertDialogCancel disabled={isDeleting}>বাতিল করুন</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClass}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "মুছে ফেলা হচ্ছে..." : "মুছুন"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}