// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useState } from "react";
// import {
//   Search, BookOpen, Edit2, Trash2, Star, Users,
//   Clock, CalendarDays, BadgeCheck, PlayCircle,
//   ArrowRight,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { PageHeader } from "@/components/layout/page-header";
// import Link from "next/link";
// import { useUser } from "@/context/UserContext";
// import { useGetMyCoursesQuery } from "@/redux/features/course/course.api";


// // ─── Types ────────────────────────────────────────────────────────────────────

// interface CourseItem {
//   _id: string;
//   title: string;
//   slug?: string;
//   description?: string;
//   thumbnail?: string;
//   class?: { _id: string; title: string } | string;
//   batch?: string;
//   regularPrice?: number;
//   discountPrice?: number;
//   courseStartDate?: string;
//   courseEndDate?: string;
//   duration?: string;
//   totalClasses?: number;
//   status?: "upcoming" | "running" | "completed";
//   isFeatured?: boolean;
//   isActive?: boolean;
//   certificate?: boolean;
//   ratings?: number;
// }

// export interface IEnrollment {
//   _id: string;
//   student: string;
//   course: CourseItem;
//   transactionId: string;
//   status: "PENDING" | "COMPLETED" | "FAILED";
//   progress: number;
//   createdBy: string;
//   isActive: boolean;
//   isDeleted: boolean;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export interface IAssignSubWithTeacher {
//   _id: string;
//   subject: string;
//   teacher: string;
// }

// export interface IReview {
//   // Future review structure
// }

// // ─── Status config ────────────────────────────────────────────────────────────

// const statusConfig = {
//   upcoming: { label: "Upcoming", dot: "bg-blue-500", badge: "text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-blue-700 border-blue-200 dark:text-blue-400 dark:border-amber-800 backdrop-blur-sm" },
//   running: { label: "Running", dot: "bg-emerald-500", badge: "text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-green-700 border-blue-200 dark:text-green-400 dark:border-amber-800 backdrop-blur-sm" },
//   completed: { label: "Completed", dot: "bg-slate-400", badge: "text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-blue-700 border-blue-200 dark:text-blue-400 dark:border-amber-800 backdrop-blur-sm" },
// };

// export const getDashboardBasePath = (role: "ADMIN" | "TEACHER" | "STUDENT") => {
//   switch (role) {
//     case "ADMIN":
//       return "/admin/dashboard";
//     case "TEACHER":
//       return "/teacher/dashboard";
//     case "STUDENT":
//       return "/student/dashboard";
//     default:
//       return "/";
//   }
// };

// // ─── Skeleton Card ────────────────────────────────────────────────────────────

// function CourseCardSkeleton() {
//   return (
//     <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
//       <Skeleton className="w-full h-44" />
//       <div className="p-4 space-y-3">
//         <Skeleton className="h-5 w-3/4" />
//         <Skeleton className="h-4 w-full" />
//         <Skeleton className="h-4 w-2/3" />
//         <div className="flex gap-2 pt-2">
//           <Skeleton className="h-8 flex-1 rounded-lg" />
//           <Skeleton className="h-8 w-8 rounded-lg" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Main Component ────────────────────────────────────────────────────────────

// export default function CourseManagementForStudent() {
//   const [searchTerm, setSearchTerm] = useState("");

//   const { data: coursesData, isLoading, refetch } = useGetMyCoursesQuery({
//     searchTerm: searchTerm || undefined,
//     limit: 50,
//   });

//   const enrollments = (coursesData as { data?: IEnrollment[] })?.data ?? [];

//   console.log("My Courses:", enrollments);
//   const { user } = useUser();

//   const userRole = user?.role;
//   if (!userRole) return null;

//   const getClassName = (cls: CourseItem["class"]) =>
//     typeof cls === "object" && cls ? cls.title : "";

//   const formatPrice = (regular?: number, discount?: number) => {
//     if (!regular && !discount) return null;
//     if (discount && regular && discount < regular) {
//       return (
//         <div className="flex items-baseline gap-1.5">
//           <span className="text-lg font-bold text-slate-900 dark:text-white">৳{discount.toLocaleString()}</span>
//           <span className="text-xs text-slate-400 line-through">৳{regular.toLocaleString()}</span>
//           <span className="text-xs font-semibold text-emerald-600">
//             {Math.round(((regular - discount) / regular) * 100)}% Discount
//           </span>
//         </div>
//       );
//     }
//     return <span className="text-lg font-bold text-slate-900 dark:text-white">৳{(discount || regular)?.toLocaleString()}</span>;
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="My Courses"
//         description="My All Enrolled Courses"
//         breadcrumbs={[
//           { label: "Dashboard", href: "/dashboard" },
//           { label: "My Courses" },
//         ]}
//       />

//       {/* Search */}
//       <div className="relative max-w-md">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//         <Input
//           placeholder="Search with course title..."
//           className="pl-9 h-10"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Course Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//         {isLoading ? (
//           Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)
//         ) : enrollments.length === 0 ? (
//           <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
//             <BookOpen className="w-14 h-14 mb-4 opacity-20" />
//             <p className="text-base font-medium">
//               {searchTerm ? "No Result Found" : "No Course Found"}
//             </p>
//             <p className="text-sm mt-1">
//               {searchTerm ? `No courses could be found with ${searchTerm}` : "Course found"}
//             </p>
//           </div>
//         ) : (
//           enrollments.map((enrollment) => {
//             const isDisabled = enrollment.status !== "COMPLETED";
//             const status = enrollment.course.status ?? "upcoming";
//             const cfg = statusConfig[status] ?? statusConfig.upcoming;
//             const className = getClassName(enrollment.course.class);

//             return (
//               <div
//                 key={enrollment.course._id}
//                 className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-400 dark:border-slate-800 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all flex flex-col group"
//               >
//                 {/* Thumbnail */}
//                 <div className="relative overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 h-44">
//                   {enrollment.course.thumbnail ? (
//                     <img
//                       src={enrollment.course.thumbnail}
//                       alt={enrollment.course.title}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <PlayCircle className="w-12 h-12 text-slate-300 dark:text-slate-600" />
//                     </div>
//                   )}

//                   {/* Overlay badges */}
//                   <div className="absolute top-2 left-2 flex flex-col gap-1.5">
//                     <Badge variant="outline" className={`text-[11px] px-2 py-0.5 border font-medium backdrop-blur-sm ${cfg.badge}`}>
//                       <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${cfg.dot}`} />
//                       {cfg.label}
//                     </Badge>
//                     {enrollment.course.isFeatured && (
//                       <Badge variant="outline" className="text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800 backdrop-blur-sm">
//                         <Star className="h-2.5 w-2.5 mr-1 fill-amber-500 text-amber-500" /> Featured
//                       </Badge>
//                     )}
//                   </div>

//                   {enrollment.course.certificate && (
//                     <div className="absolute top-2 right-2">
//                       <div className="w-7 h-7 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center shadow-sm" title="সার্টিফিকেট আছে">
//                         <BadgeCheck className="w-4 h-4 text-emerald-500" />
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Card body */}
//                 <div className="p-4 border flex flex-col flex-1">

//                   {/* Class + batch tag */}
//                   <div className="flex items-center gap-1.5 mb-2 flex-wrap">
//                     {className && (
//                       <span className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
//                         {className}
//                       </span>
//                     )}
//                     {enrollment.course.batch && (
//                       <span className="text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
//                         {enrollment.course.batch}
//                       </span>
//                     )}
//                   </div>

//                   {/* Title */}
//                   <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug mb-1 line-clamp-2">
//                     {enrollment.course.title}
//                   </h3>

//                   {/* Description */}
//                   {enrollment.course.description && (
//                     <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
//                       {enrollment.course.description}
//                     </p>
//                   )}

//                   {/* Meta info */}
//                   <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 mb-3 mt-auto">
//                     {enrollment.course.totalClasses && (
//                       <span className="flex items-center gap-1">
//                         <Clock className="w-3 h-3" /> {enrollment.course.totalClasses} Class
//                       </span>
//                     )}
//                     {enrollment.course.duration && (
//                       <span className="flex items-center gap-1">
//                         <CalendarDays className="w-3 h-3" /> {enrollment.course.duration}
//                       </span>
//                     )}
//                   </div>

//                   {/* Price */}
//                   {(enrollment.course.regularPrice || enrollment.course.discountPrice) && (
//                     <div className="mb-3">
//                       {formatPrice(enrollment.course.regularPrice, enrollment.course.discountPrice)}
//                     </div>
//                   )}

//                   {/* Action buttons */}
//                   <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 ">
//                     <Link
//                       href={
//                         isDisabled
//                           ? "#"
//                           : `${getDashboardBasePath(userRole)}/courses/view-course/${enrollment.course.slug}`
//                       }
//                       className="block w-full">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="flex-1 text-xs h-8 w-full cursor-pointer"
//                       >
//                         <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
//                         Continue
//                       </Button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//     </div>
//   );
// }


/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import {
  Search, BookOpen, Star, Clock, CalendarDays, BadgeCheck,
  PlayCircle, ArrowRight, CreditCard, Loader2, AlertCircle,
  CheckCircle2, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";
import {
  Dialog, DialogContent,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useGetMyCoursesQuery } from "@/redux/features/course/course.api";
import { useInitPaymentMutation } from "@/redux/features/payment/payment.api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CourseItem {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  class?: { _id: string; title: string } | string;
  batch?: string;
  regularPrice?: number;
  discountPrice?: number;
  courseStartDate?: string;
  courseEndDate?: string;
  duration?: string;
  totalClasses?: number;
  status?: "upcoming" | "running" | "completed";
  isFeatured?: boolean;
  isActive?: boolean;
  certificate?: boolean;
  ratings?: number;
}

export interface IEnrollment {
  _id: string;
  student: string;
  course: CourseItem;
  transactionId: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  progress: number;
  createdBy: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig = {
  upcoming:  { label: "Upcoming",  dot: "bg-blue-500",    badge: "text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-800 backdrop-blur-sm" },
  running:   { label: "Running",   dot: "bg-emerald-500", badge: "text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-green-700 border-green-200 dark:text-green-400 dark:border-green-800 backdrop-blur-sm" },
  completed: { label: "Completed", dot: "bg-slate-400",   badge: "text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-slate-700 border-slate-200 dark:text-slate-400 dark:border-slate-700 backdrop-blur-sm" },
};

const enrollmentStatusConfig = {
  PENDING:   { label: "পেমেন্ট বাকি", pill: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400" },
  FAILED:    { label: "পেমেন্ট ব্যর্থ", pill: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400" },
  COMPLETED: { label: "সক্রিয়", pill: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400" },
};

export const getDashboardBasePath = (role: "ADMIN" | "TEACHER" | "STUDENT") => {
  switch (role) {
    case "ADMIN":   return "/admin/dashboard";
    case "TEACHER": return "/teacher/dashboard";
    case "STUDENT": return "/student/dashboard";
    default:        return "/";
  }
};

// ─── Payment Modal ────────────────────────────────────────────────────────────

function PaymentModal({
  open,
  onOpenChange,
  enrollment,
  onConfirm,
  isLoading,
  error,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  enrollment: IEnrollment | null;
  onConfirm: () => void;
  isLoading: boolean;
  error: string | null;
}) {
  if (!enrollment) return null;
  const price = enrollment.course.discountPrice ?? enrollment.course.regularPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm p-0 gap-0 rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#111c2e] overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-emerald-400 via-teal-400 to-emerald-500" />

        <div className="p-6 flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">পেমেন্ট করুন</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              পেমেন্ট সম্পন্ন করে কোর্সের সম্পূর্ণ অ্যাক্সেস পান
            </p>
          </div>

          {/* Course info */}
          <div className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/4 border border-slate-100 dark:border-white/6">
            {enrollment.course.thumbnail ? (
              <img
                src={enrollment.course.thumbnail}
                alt={enrollment.course.title}
                className="w-14 h-14 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-slate-200 dark:bg-white/8 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-slate-400" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-2 leading-snug">
                {enrollment.course.title}
              </p>
              {enrollment.course.batch && (
                <p className="text-xs text-slate-400 mt-1">{enrollment.course.batch}</p>
              )}
            </div>
          </div>

          {/* Amount */}
          {price && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
              <span className="text-sm text-slate-600 dark:text-slate-400">পেমেন্টের পরিমাণ</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">৳{price.toLocaleString()}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-semibold text-sm
                transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.35)]
                active:scale-95"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> পেমেন্ট শুরু হচ্ছে...</>
              ) : (
                <><CreditCard className="w-4 h-4" /> SSLCommerz এ যান</>
              )}
            </button>
            <button
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl
                bg-slate-100 dark:bg-white/5
                border border-slate-200 dark:border-white/8
                text-slate-600 dark:text-slate-400
                font-medium text-sm
                hover:bg-slate-200 dark:hover:bg-white/10
                transition-all active:scale-95 disabled:opacity-50"
            >
              বাতিল করুন
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function CourseCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <Skeleton className="w-full h-44" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 flex-1 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CourseManagementForStudent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<IEnrollment | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const { data: coursesData, isLoading } = useGetMyCoursesQuery({
    searchTerm: searchTerm || undefined,
    limit: 50,
  });

  const [initPayment, { isLoading: paymentLoading }] = useInitPaymentMutation();

  const enrollments = (coursesData as { data?: IEnrollment[] })?.data ?? [];
  const { user } = useUser();
  const userRole = user?.role;
  if (!userRole) return null;

  console.log("user ",  user)

  const getClassName = (cls: CourseItem["class"]) =>
    typeof cls === "object" && cls ? cls.title : "";

  // Open payment modal
  const handlePaymentClick = (enrollment: IEnrollment) => {
    setSelectedEnrollment(enrollment);
    setPaymentError(null);
    setPaymentModal(true);
  };

  // Call init payment → redirect to SSLCommerz
  const handlePaymentConfirm = async () => {
    if (!selectedEnrollment) return;
    setPaymentError(null);

    try {
      const result = await initPayment(selectedEnrollment._id).unwrap();
      const paymentUrl = (result as any)?.data?.paymentUrl;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        setPaymentError("পেমেন্ট URL পাওয়া যায়নি। আবার চেষ্টা করুন।");
      }
    } catch (err: any) {
      const msg = err?.data?.message ?? "পেমেন্ট শুরু করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setPaymentError(msg);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Courses"
        description="My All Enrolled Courses"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Courses" },
        ]}
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search with course title..."
          className="pl-9 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)
        ) : enrollments.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
            <BookOpen className="w-14 h-14 mb-4 opacity-20" />
            <p className="text-base font-medium">
              {searchTerm ? "No Result Found" : "No Course Found"}
            </p>
            <p className="text-sm mt-1">
              {searchTerm ? `"${searchTerm}" দিয়ে কোনো কোর্স পাওয়া যায়নি` : "এখনও কোনো কোর্সে ভর্তি হননি"}
            </p>
          </div>
        ) : (
          enrollments.map((enrollment) => {
            const isCompleted = enrollment.status === "COMPLETED";
            const isPending   = enrollment.status === "PENDING";
            const isFailed    = enrollment.status === "FAILED";
            const needsPayment = isPending || isFailed;

            const courseStatus = enrollment.course.status ?? "upcoming";
            const cfg = statusConfig[courseStatus] ?? statusConfig.upcoming;
            const enrollCfg = enrollmentStatusConfig[enrollment.status];
            const className = getClassName(enrollment.course.class);

            return (
              <div
                key={enrollment._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all flex flex-col group"
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 h-44">
                  {enrollment.course.thumbnail ? (
                    <img
                      src={enrollment.course.thumbnail}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}

                  {/* Lock overlay for non-completed */}
                  {needsPayment && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Status badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                    <Badge variant="outline" className={`${cfg.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${cfg.dot}`} />
                      {cfg.label}
                    </Badge>
                    {enrollment.course.isFeatured && (
                      <Badge variant="outline" className="text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800 backdrop-blur-sm">
                        <Star className="h-2.5 w-2.5 mr-1 fill-amber-500 text-amber-500" /> Featured
                      </Badge>
                    )}
                  </div>

                  {enrollment.course.certificate && (
                    <div className="absolute top-2 right-2">
                      <div className="w-7 h-7 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center shadow-sm" title="সার্টিফিকেট আছে">
                        <BadgeCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-4 flex flex-col flex-1">

                  {/* Enrollment status pill */}
                  <div className="mb-2.5">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${enrollCfg.pill}`}>
                      {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                      {needsPayment && <CreditCard className="w-3 h-3" />}
                      {enrollCfg.label}
                    </span>
                  </div>

                  {/* Class + batch */}
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    {className && (
                      <span className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                        {className}
                      </span>
                    )}
                    {enrollment.course.batch && (
                      <span className="text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        {enrollment.course.batch}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug mb-1 line-clamp-2">
                    {enrollment.course.title}
                  </h3>

                  {/* Description */}
                  {enrollment.course.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                      {enrollment.course.description}
                    </p>
                  )}

                  {/* Meta info */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 mb-3 mt-auto">
                    {enrollment.course.totalClasses && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {enrollment.course.totalClasses} Class
                      </span>
                    )}
                    {enrollment.course.duration && (
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" /> {enrollment.course.duration}
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {isCompleted ? (
                      /* Completed → Continue course */
                      <Link
                        href={`${getDashboardBasePath(userRole)}/courses/view-course/${enrollment.course.slug}`}
                        className="block w-full"
                      >
                        <Button variant="outline" size="sm" className="w-full text-xs h-8">
                          <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
                          Continue
                        </Button>
                      </Link>
                    ) : (
                      /* Pending / Failed → Pay now */
                      <button
                        onClick={() => handlePaymentClick(enrollment)}
                        className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg
                          bg-emerald-500 hover:bg-emerald-400
                          text-white font-semibold text-xs
                          transition-all hover:shadow-[0_0_16px_rgba(34,197,94,0.3)]
                          active:scale-95"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        {isFailed ? "আবার পেমেন্ট করুন" : "পেমেন্ট করুন"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentModal}
        onOpenChange={setPaymentModal}
        enrollment={selectedEnrollment}
        onConfirm={handlePaymentConfirm}
        isLoading={paymentLoading}
        error={paymentError}
      />
    </div>
  );
}