// // // /* eslint-disable @typescript-eslint/no-unused-vars */
// // // /* eslint-disable @typescript-eslint/no-explicit-any */
// // // "use client";

// // // import React, { useState, useEffect } from "react";
// // // import { useTranslations } from "next-intl";
// // // import { Plus, Users, DollarSign, TrendingUp, Award } from "lucide-react";
// // // import { Button } from "@/components/ui/button";
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // import { DataTable } from "@/components/table/data-table";
// // // import { PageHeader } from "@/components/layout/page-header";
// // // import { FilterCard, FilterField } from "@/components/filter/filter-card";
// // // import { StatusBadge } from "@/components/badges/status-badge";
// // // import { PaymentService } from "@/lib/services/data-service";
// // // import type { Payment } from "@/types";

// // // export default function Payments() {
// // //   const t = useTranslations();
// // //   const [payments, setPayments] = useState<Payment[]>([]);
// // //   const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [filters, setFilters] = useState<Record<string, any>>({});

// // //   // Load payments
// // //   useEffect(() => {
// // //     const loadPayments = async () => {
// // //       setLoading(true);
// // //       try {
// // //         const data = await PaymentService.getAll();
// // //         setPayments(data);
// // //         setFilteredPayments(data);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };
// // //     loadPayments();
// // //   }, []);

// // //   // Apply filters
// // //   useEffect(() => {
// // //     let result = [...payments];

// // //     if (filters.studentName) {
// // //       result = result.filter((p) =>
// // //         p.studentName.toLowerCase().includes(filters.studentName.toLowerCase()),
// // //       );
// // //     }

// // //     if (filters.status && filters.status !== "") {
// // //       result = result.filter((p) => p.status === filters.status);
// // //     }

// // //     if (filters.type && filters.type !== "") {
// // //       result = result.filter((p) => p.type === filters.type);
// // //     }

// // //     setTimeout(() => {
// // //       setFilteredPayments(result);
// // //     }, 100);
// // //   }, [filters, payments]);

// // //   // Calculate statistics
// // //   const stats = {
// // //     totalStudents: new Set(payments.map((p) => p.studentName)).size,
// // //     totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
// // //     totalFee: payments
// // //       .filter((p) => p.type === "tuition")
// // //       .reduce((sum, p) => sum + p.amount, 0),
// // //     totalOther: payments
// // //       .filter((p) => p.type !== "tuition")
// // //       .reduce((sum, p) => sum + p.amount, 0),
// // //   };

// // //   const filterFields: FilterField[] = [
// // //     {
// // //       id: "studentName",
// // //       label: "শিক্ষার্থীর নাম",
// // //       type: "text",
// // //       placeholder: "নাম অনুসন্ধান করুন...",
// // //     },
// // //     {
// // //       id: "type",
// // //       label: "পেমেন্ট ধরন",
// // //       type: "select",
// // //       options: [
// // //         { value: "tuition", label: "টিউশন" },
// // //         { value: "activity", label: "কার্যক্রম" },
// // //         { value: "other", label: "অন্যান্য" },
// // //       ],
// // //     },
// // //     {
// // //       id: "status",
// // //       label: "স্ট্যাটাস",
// // //       type: "select",
// // //       options: [
// // //         { value: "completed", label: "সম্পন্ন" },
// // //         { value: "pending", label: "অপেক্ষমাণ" },
// // //         { value: "failed", label: "ব্যর্থ" },
// // //       ],
// // //     },
// // //     {
// // //       id: "dateRange",
// // //       label: "তারিখ পরিসীমা",
// // //       type: "date-range",
// // //     },
// // //   ];

// // //   const columns = [
// // //     { key: "id" as const, label: "পেমেন্ট আইডি", width: "10%" },
// // //     {
// // //       key: "studentName" as const,
// // //       label: "শিক্ষার্থীর নাম",
// // //       width: "15%",
// // //     },
// // //     {
// // //       key: "amount" as const,
// // //       label: "পরিমাণ",
// // //       width: "12%",
// // //       render: (value: number) => `৳${value.toLocaleString("bn-BD")}`,
// // //     },
// // //     {
// // //       key: "type" as const,
// // //       label: "ধরন",
// // //       width: "12%",
// // //       render: (value: string) => {
// // //         const typeMap: Record<string, string> = {
// // //           tuition: "টিউশন",
// // //           activity: "কার্যক্রম",
// // //           other: "অন্যান্য",
// // //         };
// // //         return typeMap[value] || value;
// // //       },
// // //     },
// // //     {
// // //       key: "date" as const,
// // //       label: "তারিখ",
// // //       width: "12%",
// // //     },
// // //     {
// // //       key: "status" as const,
// // //       label: "স্ট্যাটাস",
// // //       width: "15%",
// // //       render: (value: string) => {
// // //         const statusMap: Record<
// // //           string,
// // //           { status: "success" | "pending" | "failed"; label: string }
// // //         > = {
// // //           completed: { status: "success", label: "সম্পন্ন" },
// // //           pending: { status: "pending", label: "অপেক্ষমাণ" },
// // //           failed: { status: "failed", label: "ব্যর্থ" },
// // //         };
// // //         const s = statusMap[value] || statusMap.pending;
// // //         return <StatusBadge status={s.status} label={s.label} />;
// // //       },
// // //     },
// // //   ];

// // //   return (
// // //     <div className="space-y-6">
// // //       <PageHeader
// // //         title="Student Payment"
// // //         description="Manage All Students Payments"
// // //         breadcrumbs={[
// // //           { label: "Dashboard", href: "/bn/dashboard" },
// // //           { label: "Student Payment" },
// // //         ]}
// // //         action={
// // //           <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
// // //             <Plus className="w-4 h-4" />
// // //             নতুন পেমেন্ট
// // //           </Button>
// // //         }
// // //       />

// // //       {/* Stats Cards */}
// // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// // //         <Card className="bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800">
// // //           <CardHeader className="pb-3">
// // //             <div className="flex items-center justify-between">
// // //               <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
// // //                 মোট ছাত্র
// // //               </CardTitle>
// // //               <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
// // //                 <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
// // //               </div>
// // //             </div>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <p className="text-2xl font-bold text-gray-900 dark:text-white">
// // //               {stats.totalStudents}
// // //             </p>
// // //           </CardContent>
// // //         </Card>

// // //         <Card className="bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800">
// // //           <CardHeader className="pb-3">
// // //             <div className="flex items-center justify-between">
// // //               <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
// // //                 মোট পেমেন্ট
// // //               </CardTitle>
// // //               <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
// // //                 <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
// // //               </div>
// // //             </div>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <p className="text-2xl font-bold text-gray-900 dark:text-white">
// // //               ৳{(stats.totalAmount / 100000).toFixed(1)}L
// // //             </p>
// // //           </CardContent>
// // //         </Card>

// // //         <Card className="bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800">
// // //           <CardHeader className="pb-3">
// // //             <div className="flex items-center justify-between">
// // //               <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
// // //                 মোট টিউশন
// // //               </CardTitle>
// // //               <div className="p-2 bg-amber-100 dark:bg-amber-950 rounded-lg">
// // //                 <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
// // //               </div>
// // //             </div>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <p className="text-2xl font-bold text-gray-900 dark:text-white">
// // //               ৳{(stats.totalFee / 100000).toFixed(1)}L
// // //             </p>
// // //           </CardContent>
// // //         </Card>

// // //         <Card className="bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800">
// // //           <CardHeader className="pb-3">
// // //             <div className="flex items-center justify-between">
// // //               <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
// // //                 মোট অন্যান্য
// // //               </CardTitle>
// // //               <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
// // //                 <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
// // //               </div>
// // //             </div>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <p className="text-2xl font-bold text-gray-900 dark:text-white">
// // //               ৳{(stats.totalOther / 100000).toFixed(1)}L
// // //             </p>
// // //           </CardContent>
// // //         </Card>
// // //       </div>

// // //       {/* Filters */}
// // //       <FilterCard
// // //         fields={filterFields}
// // //         onFilterChange={setFilters}
// // //         onReset={() => {
// // //           setFilters({});
// // //           setFilteredPayments(payments);
// // //         }}
// // //       />

// // //       {/* Data Table */}
// // //       <DataTable
// // //         columns={columns}
// // //         data={filteredPayments}
// // //         pageSize={10}
// // //         title="শিক্ষার্থী পেমেন্ট রেকর্ড"
// // //       />
// // //     </div>
// // //   );
// // // }



// // "use client";

// // import { useState } from "react";
// // import { toast } from "sonner";
// // import {
// //     CreditCard, Eye, Pencil, Trash2, Search,
// //     ChevronLeft, ChevronRight, RefreshCw,
// //     CheckCircle2, XCircle, Clock, Ban, RotateCcw,
// // } from "lucide-react";

// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Badge } from "@/components/ui/badge";
// // import { Separator } from "@/components/ui/separator";
// // import {
// //     Dialog, DialogContent, DialogHeader,
// //     DialogTitle, DialogDescription,
// // } from "@/components/ui/dialog";
// // import {
// //     AlertDialog, AlertDialogAction, AlertDialogCancel,
// //     AlertDialogContent, AlertDialogDescription,
// //     AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
// // } from "@/components/ui/alert-dialog";

// // import {
// //     useGetAllPaymentsQuery,
// //     useDeletePaymentMutation,
// // } from "@/redux/features/payment/payment.api";
// // import { UpdatePaymentModal } from "./UpdatePaymentModal";

// // // ─── Status config ─────────────────────────────────────────────────────────────

// // const STATUS_CONFIG: Record<string, {
// //     label: string;
// //     icon: React.ElementType;
// //     variant: "default" | "secondary" | "destructive" | "outline";
// //     className: string;
// // }> = {
// //     COMPLETED: {
// //         label: "Completed",
// //         icon: CheckCircle2,
// //         variant: "default",
// //         className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
// //     },
// //     UNPAID: {
// //         label: "Unpaid",
// //         icon: Clock,
// //         variant: "secondary",
// //         className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
// //     },
// //     FAILED: {
// //         label: "Failed",
// //         icon: XCircle,
// //         variant: "destructive",
// //         className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
// //     },
// //     CANCELLED: {
// //         label: "Cancelled",
// //         icon: Ban,
// //         variant: "outline",
// //         className: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
// //     },
// //     REFUNDED: {
// //         label: "Refunded",
// //         icon: RotateCcw,
// //         variant: "outline",
// //         className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
// //     },
// // };

// // function StatusBadge({ status }: { status: string }) {
// //     const config = STATUS_CONFIG[status] ?? STATUS_CONFIG["UNPAID"];
// //     const Icon = config.icon;
// //     return (
// //         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${config.className}`}>
// //             <Icon className="w-3 h-3" />
// //             {config.label}
// //         </span>
// //     );
// // }

// // // ─── View Details Modal ────────────────────────────────────────────────────────

// // function ViewPaymentModal({ open, onOpenChange, item }: {
// //     open: boolean;
// //     onOpenChange: (v: boolean) => void;
// //     item: any;
// // }) {
// //     if (!item) return null;
// //     const enrollment = item.enrollment;

// //     const rows = [
// //         { label: "Payment ID", value: item._id },
// //         { label: "Transaction ID", value: item.transactionId },
// //         { label: "Amount", value: `৳ ${item.amount?.toLocaleString()}` },
// //         { label: "Payment Status", value: <StatusBadge status={item.status} /> },
// //         { label: "Invoice URL", value: item.invoiceUrl ? (
// //             <a href={item.invoiceUrl} target="_blank" rel="noopener noreferrer"
// //                 className="text-blue-500 underline text-xs truncate max-w-[200px] block">
// //                 {item.invoiceUrl}
// //             </a>
// //         ) : "—" },
// //         { label: "Created At", value: new Date(item.createdAt).toLocaleString() },
// //         { label: "Updated At", value: new Date(item.updatedAt).toLocaleString() },
// //     ];

// //     const enrollmentRows = enrollment ? [
// //         { label: "Enrollment ID", value: enrollment._id },
// //         { label: "Enrollment Status", value: <StatusBadge status={enrollment.status} /> },
// //         { label: "Progress", value: `${enrollment.progress ?? 0}%` },
// //         { label: "Active", value: enrollment.isActive ? "Yes" : "No" },
// //     ] : [];

// //     return (
// //         <Dialog open={open} onOpenChange={onOpenChange}>
// //             <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
// //                 <DialogHeader className="flex flex-col items-center gap-2 pb-2">
// //                     <DialogTitle className="text-xl font-bold tracking-widest uppercase">
// //                         Payment Details
// //                     </DialogTitle>
// //                     <DialogDescription className="text-[#96999A] text-sm tracking-wide">
// //                         Full payment & enrollment info
// //                     </DialogDescription>
// //                 </DialogHeader>

// //                 <Separator />

// //                 {/* Payment Info */}
// //                 <div>
// //                     <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
// //                         Payment Info
// //                     </p>
// //                     <div className="rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
// //                         {rows.map(({ label, value }) => (
// //                             <div key={label} className="flex items-center justify-between px-4 py-2.5 gap-4">
// //                                 <span className="text-[11px] font-semibold tracking-widest uppercase text-slate-400 shrink-0">
// //                                     {label}
// //                                 </span>
// //                                 <span className="text-xs text-slate-700 dark:text-slate-300 text-right font-mono break-all">
// //                                     {value}
// //                                 </span>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 </div>

// //                 {/* Enrollment Info */}
// //                 {enrollment && (
// //                     <div>
// //                         <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
// //                             Linked Enrollment
// //                         </p>
// //                         <div className="rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
// //                             {enrollmentRows.map(({ label, value }) => (
// //                                 <div key={label} className="flex items-center justify-between px-4 py-2.5 gap-4">
// //                                     <span className="text-[11px] font-semibold tracking-widest uppercase text-slate-400 shrink-0">
// //                                         {label}
// //                                     </span>
// //                                     <span className="text-xs text-slate-700 dark:text-slate-300 text-right font-mono">
// //                                         {value}
// //                                     </span>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 )}
// //             </DialogContent>
// //         </Dialog>
// //     );
// // }

// // // ─── Main Page ─────────────────────────────────────────────────────────────────

// // export default function PaymentManagementPage() {
// //     const [page, setPage] = useState(1);
// //     const [search, setSearch] = useState("");
// //     const [searchInput, setSearchInput] = useState("");

// //     const [viewItem, setViewItem] = useState<any>(null);
// //     const [editItem, setEditItem] = useState<any>(null);
// //     const [deleteItem, setDeleteItem] = useState<any>(null);

// //     const { data, isLoading, isFetching, refetch } = useGetAllPaymentsQuery({
// //         page,
// //         limit: 10,
// //         ...(search ? { searchTerm: search } : {}),
// //     });

// //     const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();

// //     const payments: any[] = data?.data ?? [];
// //     const meta = data?.meta;

// //     const handleSearch = (e: React.FormEvent) => {
// //         e.preventDefault();
// //         setPage(1);
// //         setSearch(searchInput);
// //     };

// //     const handleDelete = async () => {
// //         if (!deleteItem) return;
// //         try {
// //             await deletePayment(deleteItem._id).unwrap();
// //             toast.success("Payment deleted successfully");
// //             setDeleteItem(null);
// //         } catch (error: any) {
// //             toast.error(error?.data?.message || "Failed to delete payment");
// //         }
// //     };

// //     return (
// //         <div className="p-6 space-y-6">

// //             {/* ── Header ── */}
// //             <div className="flex items-center justify-between flex-wrap gap-3">
// //                 <div>
// //                     <h1 className="text-2xl font-bold tracking-widest uppercase">
// //                         Payment Management
// //                     </h1>
// //                     <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
// //                         {meta?.total ?? 0} total payments
// //                     </p>
// //                 </div>
// //                 <Button
// //                     variant="outline"
// //                     size="sm"
// //                     onClick={() => refetch()}
// //                     disabled={isFetching}
// //                     className="cursor-pointer"
// //                 >
// //                     <RefreshCw className={`h-4 w-4 mr-1 ${isFetching ? "animate-spin" : ""}`} />
// //                     Refresh
// //                 </Button>
// //             </div>

// //             {/* ── Search ── */}
// //             <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
// //                 <Input
// //                     placeholder="Search by transaction ID..."
// //                     value={searchInput}
// //                     onChange={(e) => setSearchInput(e.target.value)}
// //                 />
// //                 <Button type="submit" variant="outline" size="icon" className="cursor-pointer shrink-0">
// //                     <Search className="h-4 w-4" />
// //                 </Button>
// //             </form>

// //             {/* ── Table ── */}
// //             <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
// //                 <div className="overflow-x-auto">
// //                     <table className="w-full text-sm">
// //                         <thead>
// //                             <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
// //                                 {["#", "Transaction ID", "Amount", "Payment Status", "Enrollment Status", "Date", "Actions"].map((h) => (
// //                                     <th key={h} className="px-4 py-3 text-left text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 whitespace-nowrap">
// //                                         {h}
// //                                     </th>
// //                                 ))}
// //                             </tr>
// //                         </thead>
// //                         <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
// //                             {isLoading ? (
// //                                 Array.from({ length: 5 }).map((_, i) => (
// //                                     <tr key={i}>
// //                                         {Array.from({ length: 7 }).map((_, j) => (
// //                                             <td key={j} className="px-4 py-3">
// //                                                 <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-24" />
// //                                             </td>
// //                                         ))}
// //                                     </tr>
// //                                 ))
// //                             ) : payments.length === 0 ? (
// //                                 <tr>
// //                                     <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
// //                                         <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
// //                                         <p className="text-sm">No payments found</p>
// //                                     </td>
// //                                 </tr>
// //                             ) : (
// //                                 payments.map((payment, idx) => (
// //                                     <tr key={payment._id}
// //                                         className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
// //                                         {/* # */}
// //                                         <td className="px-4 py-3 text-slate-400 text-xs font-mono">
// //                                             {(page - 1) * 10 + idx + 1}
// //                                         </td>
// //                                         {/* Transaction ID */}
// //                                         <td className="px-4 py-3">
// //                                             <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
// //                                                 {payment.transactionId}
// //                                             </span>
// //                                         </td>
// //                                         {/* Amount */}
// //                                         <td className="px-4 py-3">
// //                                             <span className="font-bold text-slate-800 dark:text-slate-200">
// //                                                 ৳ {payment.amount?.toLocaleString()}
// //                                             </span>
// //                                         </td>
// //                                         {/* Payment Status */}
// //                                         <td className="px-4 py-3">
// //                                             <StatusBadge status={payment.status} />
// //                                         </td>
// //                                         {/* Enrollment Status */}
// //                                         <td className="px-4 py-3">
// //                                             {payment.enrollment?.status ? (
// //                                                 <StatusBadge status={payment.enrollment.status} />
// //                                             ) : "—"}
// //                                         </td>
// //                                         {/* Date */}
// //                                         <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
// //                                             {new Date(payment.createdAt).toLocaleDateString("en-GB", {
// //                                                 day: "2-digit", month: "short", year: "numeric",
// //                                             })}
// //                                         </td>
// //                                         {/* Actions */}
// //                                         <td className="px-4 py-3">
// //                                             <div className="flex items-center gap-1">
// //                                                 <Button
// //                                                     size="icon" variant="ghost"
// //                                                     className="h-8 w-8 cursor-pointer"
// //                                                     onClick={() => setViewItem(payment)}
// //                                                     title="View details"
// //                                                 >
// //                                                     <Eye className="h-4 w-4" />
// //                                                 </Button>
// //                                                 <Button
// //                                                     size="icon" variant="ghost"
// //                                                     className="h-8 w-8 cursor-pointer"
// //                                                     onClick={() => setEditItem(payment)}
// //                                                     title="Edit payment"
// //                                                 >
// //                                                     <Pencil className="h-4 w-4" />
// //                                                 </Button>
// //                                                 <Button
// //                                                     size="icon" variant="ghost"
// //                                                     className="h-8 w-8 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
// //                                                     onClick={() => setDeleteItem(payment)}
// //                                                     title="Delete payment"
// //                                                 >
// //                                                     <Trash2 className="h-4 w-4" />
// //                                                 </Button>
// //                                             </div>
// //                                         </td>
// //                                     </tr>
// //                                 ))
// //                             )}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             </div>

// //             {/* ── Pagination ── */}
// //             {meta && meta.totalPage > 1 && (
// //                 <div className="flex items-center justify-between">
// //                     <p className="text-xs text-slate-500">
// //                         Page {meta.page} of {meta.totalPage} — {meta.total} total
// //                     </p>
// //                     <div className="flex gap-2">
// //                         <Button
// //                             size="sm" variant="outline"
// //                             disabled={page <= 1}
// //                             onClick={() => setPage((p) => p - 1)}
// //                             className="cursor-pointer"
// //                         >
// //                             <ChevronLeft className="h-4 w-4" />
// //                             Prev
// //                         </Button>
// //                         <Button
// //                             size="sm" variant="outline"
// //                             disabled={page >= meta.totalPage}
// //                             onClick={() => setPage((p) => p + 1)}
// //                             className="cursor-pointer"
// //                         >
// //                             Next
// //                             <ChevronRight className="h-4 w-4" />
// //                         </Button>
// //                     </div>
// //                 </div>
// //             )}

// //             {/* ── Modals ── */}
// //             <ViewPaymentModal
// //                 open={!!viewItem}
// //                 onOpenChange={(v) => { if (!v) setViewItem(null); }}
// //                 item={viewItem}
// //             />

// //             <UpdatePaymentModal
// //                 open={!!editItem}
// //                 onOpenChange={(v) => { if (!v) setEditItem(null); }}
// //                 item={editItem}
// //                 onSuccess={() => setEditItem(null)}
// //             />

// //             {/* ── Delete Confirm ── */}
// //             <AlertDialog open={!!deleteItem} onOpenChange={(v) => { if (!v) setDeleteItem(null); }}>
// //                 <AlertDialogContent>
// //                     <AlertDialogHeader>
// //                         <AlertDialogTitle className="font-bold tracking-widest uppercase">
// //                             Delete Payment?
// //                         </AlertDialogTitle>
// //                         <AlertDialogDescription>
// //                             Transaction <span className="font-mono font-semibold">{deleteItem?.transactionId}</span> will be permanently deleted. This cannot be undone.
// //                         </AlertDialogDescription>
// //                     </AlertDialogHeader>
// //                     <AlertDialogFooter>
// //                         <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
// //                         <AlertDialogAction
// //                             onClick={handleDelete}
// //                             disabled={isDeleting}
// //                             className="bg-red-600 hover:bg-red-700 cursor-pointer"
// //                         >
// //                             {isDeleting ? "Deleting..." : "Delete"}
// //                         </AlertDialogAction>
// //                     </AlertDialogFooter>
// //                 </AlertDialogContent>
// //             </AlertDialog>
// //         </div>
// //     );
// // }



// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import {
//   Edit2,
//   Search,
//   CreditCard,
//   Eye,
//   ChevronUp,
//   ChevronDown,
//   ChevronsUpDown,
//   X,
//   Trash2,
// } from "lucide-react";
// import { toast } from "sonner";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Separator } from "@/components/ui/separator";
// import { Label } from "@/components/ui/label";
// import { PageHeader } from "@/components/layout/page-header";

// import {
//   useGetAllPaymentsQuery,
//   useDeletePaymentMutation,
//   useAdminUpdatePaymentMutation,
// } from "@/redux/features/payment/payment.api";
// import { Pagination } from "../pagination/pagination";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { PaymentDetailsModal } from "./PaymentDetailsModal";

// // ─── Types ─────────────────────────────────────────────────────────────────────

// type SortField = "transactionId" | "amount" | "status" | "createdAt";
// type SortDir = "asc" | "desc" | null;
// type PaymentStatus = "UNPAID" | "COMPLETED" | "FAILED" | "CANCELLED" | "REFUNDED";

// // ─── Status Badge ───────────────────────────────────────────────────────────────

// function StatusBadge({ status }: { status: string }) {
//   const map: Record<string, string> = {
//     COMPLETED:
//       "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
//     UNPAID:
//       "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
//     FAILED:
//       "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
//     CANCELLED:
//       "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400",
//     REFUNDED:
//       "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
//   };
//   const dot: Record<string, string> = {
//     COMPLETED: "bg-emerald-500",
//     UNPAID: "bg-amber-500",
//     FAILED: "bg-red-500",
//     CANCELLED: "bg-slate-400",
//     REFUNDED: "bg-blue-500",
//   };
//   return (
//     <Badge variant="outline" className={map[status] ?? ""}>
//       <span
//         className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${dot[status] ?? "bg-slate-400"}`}
//       />
//       {status.charAt(0) + status.slice(1).toLowerCase()}
//     </Badge>
//   );
// }

// // ─── Skeleton Row ───────────────────────────────────────────────────────────────

// function PaymentRowSkeleton() {
//   return (
//     <TableRow>
//       <TableCell><Skeleton className="h-4 w-36" /></TableCell>
//       <TableCell><Skeleton className="h-4 w-20" /></TableCell>
//       <TableCell><Skeleton className="h-4 w-24" /></TableCell>
//       <TableCell><Skeleton className="h-4 w-24" /></TableCell>
//       <TableCell><Skeleton className="h-4 w-24" /></TableCell>
//       <TableCell>
//         <div className="flex gap-1.5 justify-end">
//           <Skeleton className="h-8 w-8 rounded-md" />
//           <Skeleton className="h-8 w-8 rounded-md" />
//           <Skeleton className="h-8 w-8 rounded-md" />
//         </div>
//       </TableCell>
//     </TableRow>
//   );
// }

// // ─── Sort Icon ──────────────────────────────────────────────────────────────────

// function SortIcon({
//   field, sortField, sortDir,
// }: {
//   field: SortField; sortField: SortField | null; sortDir: SortDir;
// }) {
//   if (sortField !== field)
//     return <ChevronsUpDown className="w-3.5 h-3.5 ml-1 text-slate-400" />;
//   return sortDir === "asc"
//     ? <ChevronUp className="w-3.5 h-3.5 ml-1 text-emerald-500" />
//     : <ChevronDown className="w-3.5 h-3.5 ml-1 text-emerald-500" />;
// }


// // ─── Update Payment Modal ───────────────────────────────────────────────────────

// const updatePaymentSchema = z.object({
//   status: z.enum(["UNPAID", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"]),
//   invoiceUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
// });
// type UpdatePaymentFormValues = z.infer<typeof updatePaymentSchema>;

// function UpdatePaymentModal({
//   open, onOpenChange, item, onSuccess,
// }: {
//   open: boolean; onOpenChange: (v: boolean) => void; item: any; onSuccess?: () => void;
// }) {
//   const [selectedStatus, setSelectedStatus] = useState<string>("UNPAID");
//   const [adminUpdatePayment, { isLoading }] = useAdminUpdatePaymentMutation();

//   const { register, handleSubmit, formState: { errors }, reset, setValue } =
//     useForm<UpdatePaymentFormValues>({
//       resolver: zodResolver(updatePaymentSchema) as any,
//     });

//   useEffect(() => {
//     if (open && item) {
//       const status = item.status ?? "UNPAID";
//       setSelectedStatus(status);
//       reset({ status, invoiceUrl: item.invoiceUrl ?? "" });
//     }
//   }, [open, item, reset]);

//   const onSubmit = async (data: UpdatePaymentFormValues) => {
//     try {
//       const payload: any = { status: data.status };
//       if (data.invoiceUrl) payload.invoiceUrl = data.invoiceUrl;
//       await adminUpdatePayment({ id: item._id, data: payload }).unwrap();
//       toast.success("Payment updated successfully!");
//       onOpenChange(false);
//       onSuccess?.();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to update payment");
//     }
//   };

//   const enrollment = item?.enrollment;

//   return (
//     <Dialog open={open} onOpenChange={(val) => { if (!val) onOpenChange(false); }}>
//       <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
//         <DialogHeader className="flex flex-col items-center gap-2 pb-2">
//           <DialogTitle className="text-xl font-bold tracking-widest uppercase">
//             Edit Payment
//           </DialogTitle>
//           <DialogDescription className="text-[#96999A] text-sm tracking-wide">
//             Update payment status — enrollment will sync automatically
//           </DialogDescription>
//         </DialogHeader>

//         <Separator />

//         {/* Read-only info card */}
//         <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-2">
//           <div className="flex justify-between items-center">
//             <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Transaction ID</span>
//             <span className="text-xs font-mono text-slate-700 dark:text-slate-300">{item?.transactionId ?? "—"}</span>
//           </div>
//           <Separator />
//           <div className="flex justify-between items-center">
//             <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Amount</span>
//             <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
//               ৳ {item?.amount?.toLocaleString() ?? "—"}
//             </span>
//           </div>
//           <Separator />
//           <div className="flex justify-between items-center">
//             <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Enrollment Status</span>
//             {enrollment?.status
//               ? <StatusBadge status={enrollment.status} />
//               : <span className="text-xs text-slate-500">—</span>}
//           </div>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//           <div>
//             <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
//               Update Details
//             </p>
//             <div className="space-y-4">
//               {/* Status */}
//               <div className="space-y-1.5">
//                 <Label className="text-xs font-semibold tracking-widest uppercase">
//                   Payment Status <span className="text-red-500">*</span>
//                 </Label>
//                 <Select
//                   value={selectedStatus}
//                   onValueChange={(v) => {
//                     if (!v) return;
//                     setSelectedStatus(v);
//                     setValue("status", v as any, { shouldValidate: true });
//                   }}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="UNPAID">Unpaid</SelectItem>
//                     <SelectItem value="COMPLETED">Completed</SelectItem>
//                     <SelectItem value="FAILED">Failed</SelectItem>
//                     <SelectItem value="CANCELLED">Cancelled</SelectItem>
//                     <SelectItem value="REFUNDED">Refunded</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 {errors.status && (
//                   <p className="text-xs text-red-400">{errors.status.message}</p>
//                 )}
//               </div>

//               {/* Invoice URL */}
//               <div className="space-y-1.5">
//                 <Label htmlFor="p-invoice" className="text-xs font-semibold tracking-widest uppercase">
//                   Invoice URL{" "}
//                   <span className="text-[#96999A] normal-case font-normal">(optional)</span>
//                 </Label>
//                 <Input
//                   id="p-invoice"
//                   placeholder="https://invoice.example.com/..."
//                   {...register("invoiceUrl")}
//                 />
//                 {errors.invoiceUrl && (
//                   <p className="text-xs text-red-400">{errors.invoiceUrl.message}</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           <Button
//             type="submit"
//             disabled={isLoading}
//             className="w-full cursor-pointer font-bold tracking-widest uppercase transition-colors disabled:opacity-60"
//           >
//             {isLoading ? (
//               <span className="flex items-center gap-2">
//                 <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//                 Updating...
//               </span>
//             ) : (
//               <span className="flex items-center gap-2">
//                 <CreditCard className="h-4 w-4" />
//                 Update Payment
//               </span>
//             )}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // ─── Main Component ─────────────────────────────────────────────────────────────

// export default function PaymentManagement() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [sortField, setSortField] = useState<SortField | null>(null);
//   const [sortDir, setSortDir] = useState<SortDir>(null);
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   const [viewingPayment, setViewingPayment] = useState<any | null>(null);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [editingPayment, setEditingPayment] = useState<any | null>(null);
//   const [isUpdateOpen, setIsUpdateOpen] = useState(false);
//   const [deletingPayment, setDeletingPayment] = useState<any | null>(null);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);

//   const { data, isLoading, refetch } = useGetAllPaymentsQuery({
//     searchTerm: searchTerm || undefined,
//     status: statusFilter !== "all" ? statusFilter : undefined,
//     page,
//     limit,
//   });

//   const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();

//   const payments: any[] = data?.data ?? [];
//   const meta = data?.meta;
//   const totalPage = meta?.totalPage || 1;

//   const hasActiveFilters = statusFilter !== "all";

//   useEffect(() => { setPage(1); }, [searchTerm, statusFilter]);

//   // ── Client-side sort ──
//   const sorted = useMemo(() => {
//     if (!sortField || !sortDir) return payments;
//     return [...payments].sort((a, b) => {
//       const valA = a[sortField] ?? "";
//       const valB = b[sortField] ?? "";
//       const cmp =
//         typeof valA === "number" && typeof valB === "number"
//           ? valA - valB
//           : String(valA).localeCompare(String(valB));
//       return sortDir === "asc" ? cmp : -cmp;
//     });
//   }, [payments, sortField, sortDir]);

//   const handleSort = (field: SortField) => {
//     if (sortField !== field) { setSortField(field); setSortDir("asc"); return; }
//     if (sortDir === "asc") { setSortDir("desc"); return; }
//     setSortField(null); setSortDir(null);
//   };

//   const openDetailsDialog = (p: any) => { setViewingPayment(p); setIsDetailsOpen(true); };
//   const openEditDialog = (p: any) => { setEditingPayment(p); setIsUpdateOpen(true); };
//   const openDeleteDialog = (p: any) => { setDeletingPayment(p); setIsDeleteOpen(true); };

//   const handleDelete = async () => {
//     if (!deletingPayment) return;
//     try {
//       await deletePayment(deletingPayment._id).unwrap();
//       toast.success("Payment deleted successfully");
//       setIsDeleteOpen(false);
//       setDeletingPayment(null);
//       refetch();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to delete payment");
//     }
//   };

//   const SortableTh = ({ field, label }: { field: SortField; label: string }) => (
//     <TableHead
//       className="cursor-pointer select-none whitespace-nowrap"
//       onClick={() => handleSort(field)}
//     >
//       <span className="inline-flex items-center hover:text-slate-900 dark:hover:text-white transition-colors">
//         {label}
//         <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
//       </span>
//     </TableHead>
//   );

//   return (
//     <div className="space-y-6">

//       {/* ── Page Header ── */}
//       <PageHeader
//         title="Payment Management"
//         description="Monitor and manage all payment transactions"
//         breadcrumbs={[
//           { label: "Dashboard", href: "/dashboard" },
//           { label: "Payment Management" },
//         ]}
//       />

//       {/* ── Search + Filters ── */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <Input
//             placeholder="Search by transaction ID..."
//             className="pl-10"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <Select value={statusFilter} onValueChange={(v) => setStatusFilter(String(v))}>
//           <SelectTrigger className="w-full sm:w-40 sm:shrink-0 h-9 text-sm">
//             <span className="truncate block">
//               {statusFilter === "all"
//                 ? "All Statuses"
//                 : statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()}
//             </span>
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Statuses</SelectItem>
//             <SelectItem value="UNPAID">Unpaid</SelectItem>
//             <SelectItem value="COMPLETED">Completed</SelectItem>
//             <SelectItem value="FAILED">Failed</SelectItem>
//             <SelectItem value="CANCELLED">Cancelled</SelectItem>
//             <SelectItem value="REFUNDED">Refunded</SelectItem>
//           </SelectContent>
//         </Select>

//         {hasActiveFilters && (
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => setStatusFilter("all")}
//             title="Clear filters"
//             className="shrink-0"
//           >
//             <X className="w-4 h-4" />
//           </Button>
//         )}
//       </div>

//       {/* ── Active Filter Badge ── */}
//       {hasActiveFilters && (
//         <div className="flex flex-wrap gap-2">
//           {statusFilter !== "all" && (
//             <Badge
//               variant="secondary"
//               className="gap-1.5 pr-1 cursor-pointer"
//               onClick={() => setStatusFilter("all")}
//             >
//               Status: {statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()}
//               <X className="w-3 h-3" />
//             </Badge>
//           )}
//         </div>
//       )}

//       {/* ── Table ── */}
//       <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-slate-50 dark:bg-slate-800/50">
//                 <SortableTh field="transactionId" label="Transaction ID" />
//                 <SortableTh field="amount" label="Amount" />
//                 <SortableTh field="status" label="Payment Status" />
//                 <TableHead className="whitespace-nowrap">Enrollment Status</TableHead>
//                 <SortableTh field="createdAt" label="Date" />
//                 <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {isLoading ? (
//                 Array.from({ length: 6 }).map((_, i) => <PaymentRowSkeleton key={i} />)
//               ) : sorted.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6}>
//                     <div className="flex flex-col items-center justify-center py-16 text-slate-400">
//                       <CreditCard className="w-12 h-12 mb-4 opacity-30" />
//                       {searchTerm || hasActiveFilters ? (
//                         <>
//                           <p className="text-base font-medium">No results found</p>
//                           <p className="text-sm mt-1">Try adjusting your search or filters</p>
//                         </>
//                       ) : (
//                         <>
//                           <p className="text-base font-medium">No payments yet</p>
//                           <p className="text-sm mt-1">Payments will appear here once students enroll</p>
//                         </>
//                       )}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 sorted.map((payment) => (
//                   <TableRow
//                     key={payment._id}
//                     className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
//                   >
//                     {/* Transaction ID */}
//                     <TableCell>
//                       <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
//                         {payment.transactionId ?? "—"}
//                       </span>
//                     </TableCell>

//                     {/* Amount */}
//                     <TableCell>
//                       <span className="font-bold text-slate-800 dark:text-slate-200">
//                         ৳ {payment.amount?.toLocaleString()}
//                       </span>
//                     </TableCell>

//                     {/* Payment Status */}
//                     <TableCell>
//                       <StatusBadge status={payment.status} />
//                     </TableCell>

//                     {/* Enrollment Status */}
//                     <TableCell>
//                       {payment.enrollment?.status
//                         ? <StatusBadge status={payment.enrollment.status} />
//                         : <span className="text-slate-400 text-xs">—</span>}
//                     </TableCell>

//                     {/* Date */}
//                     <TableCell className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
//                       {new Date(payment.createdAt).toLocaleDateString("en-GB", {
//                         day: "2-digit", month: "short", year: "numeric",
//                       })}
//                     </TableCell>

//                     {/* Actions */}
//                     <TableCell>
//                       <div className="flex gap-1.5 justify-end">
//                         <Button
//                           variant="outline" size="icon" className="h-8 w-8"
//                           title="View details"
//                           onClick={() => openDetailsDialog(payment)}
//                         >
//                           <Eye className="w-3.5 h-3.5" />
//                         </Button>
//                         <Button
//                           variant="outline" size="icon" className="h-8 w-8"
//                           title="Edit payment"
//                           onClick={() => openEditDialog(payment)}
//                         >
//                           <Edit2 className="w-3.5 h-3.5" />
//                         </Button>
//                         <Button
//                           variant="destructive" size="icon" className="h-8 w-8"
//                           title="Delete payment"
//                           onClick={() => openDeleteDialog(payment)}
//                         >
//                           <Trash2 className="w-3.5 h-3.5" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>

//           <Pagination page={page} totalPage={totalPage} onPageChange={setPage} />
//         </div>

//         {/* Footer */}
//         {!isLoading && sorted.length > 0 && (
//           <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
//             <p className="text-xs text-slate-500 dark:text-slate-400">
//               Showing{" "}
//               <span className="font-semibold text-slate-700 dark:text-slate-300">
//                 {sorted.length}
//               </span>{" "}
//               payment{sorted.length !== 1 ? "s" : ""}
//               {hasActiveFilters && " (filtered)"}
//             </p>
//             {totalPage > 1 && (
//               <p className="text-xs text-slate-500 dark:text-slate-400">
//                 Page {page} of {totalPage}
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ── Details Modal ── */}
//       {viewingPayment && (
//         <PaymentDetailsModal
//           open={isDetailsOpen}
//           onOpenChange={setIsDetailsOpen}
//           item={viewingPayment}
//         />
//       )}

//       {/* ── Update Modal ── */}
//       {editingPayment && (
//         <UpdatePaymentModal
//           open={isUpdateOpen}
//           onOpenChange={setIsUpdateOpen}
//           item={editingPayment}
//           onSuccess={refetch}
//         />
//       )}

//       {/* ── Delete Confirmation ── */}
//       <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Payment</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to permanently delete transaction{" "}
//               <strong className="font-mono">{deletingPayment?.transactionId}</strong>?
//               This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <div className="flex gap-2">
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               disabled={isDeleting}
//               className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
//             >
//               {isDeleting ? "Deleting..." : "Delete"}
//             </AlertDialogAction>
//           </div>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Edit2, Search, CreditCard, Eye, ChevronUp, ChevronDown,
  ChevronsUpDown, X, Trash2, DollarSign, CheckCircle2,
  Clock, XCircle, RotateCcw, TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/page-header";

import {
  useGetAllPaymentsQuery,
  useDeletePaymentMutation,
  useAdminUpdatePaymentMutation,
} from "@/redux/features/payment/payment.api";
import { useGetAllAnalyticsQuery } from "@/redux/features/analytics/analytics.api";
import { Pagination } from "../pagination/pagination";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PaymentDetailsModal } from "./PaymentDetailsModal";

// ─── Types ─────────────────────────────────────────────────────────────────────

type SortField = "transactionId" | "amount" | "status" | "createdAt";
type SortDir = "asc" | "desc" | null;

// ─── Status Badge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
    UNPAID: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    FAILED: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
    CANCELLED: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400",
    REFUNDED: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  };
  const dot: Record<string, string> = {
    COMPLETED: "bg-emerald-500",
    UNPAID: "bg-amber-500",
    FAILED: "bg-red-500",
    CANCELLED: "bg-slate-400",
    REFUNDED: "bg-blue-500",
  };
  return (
    <Badge variant="outline" className={map[status] ?? ""}>
      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${dot[status] ?? "bg-slate-400"}`} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}

// ─── Skeleton Row ───────────────────────────────────────────────────────────────

function PaymentRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-36" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell>
        <div className="flex gap-1.5 justify-end">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-24 mb-1" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

function StatCard({
  label, value, sub, icon: Icon, color,
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: "emerald" | "blue" | "violet" | "amber" | "red";
}) {
  const colorMap = {
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600 dark:text-emerald-400", text: "text-emerald-600 dark:text-emerald-400" },
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600 dark:text-blue-400", text: "text-blue-600 dark:text-blue-400" },
    violet: { bg: "bg-violet-50 dark:bg-violet-900/20", icon: "text-violet-600 dark:text-violet-400", text: "text-violet-600 dark:text-violet-400" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600 dark:text-amber-400", text: "text-amber-600 dark:text-amber-400" },
    red: { bg: "bg-red-50 dark:bg-red-900/20", icon: "text-red-600 dark:text-red-400", text: "text-red-600 dark:text-red-400" },
  };
  const c = colorMap[color];
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <div className={`p-2 rounded-lg ${c.bg}`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      {sub && <p className={`text-xs mt-1 ${c.text}`}>{sub}</p>}
    </div>
  );
}

// ─── Sort Icon ──────────────────────────────────────────────────────────────────

function SortIcon({ field, sortField, sortDir }: {
  field: SortField; sortField: SortField | null; sortDir: SortDir;
}) {
  if (sortField !== field)
    return <ChevronsUpDown className="w-3.5 h-3.5 ml-1 text-slate-400" />;
  return sortDir === "asc"
    ? <ChevronUp className="w-3.5 h-3.5 ml-1 text-emerald-500" />
    : <ChevronDown className="w-3.5 h-3.5 ml-1 text-emerald-500" />;
}

// ─── Update Payment Modal ───────────────────────────────────────────────────────

const updatePaymentSchema = z.object({
  status: z.enum(["UNPAID", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"]),
  invoiceUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});
type UpdatePaymentFormValues = z.infer<typeof updatePaymentSchema>;

function UpdatePaymentModal({
  open, onOpenChange, item, onSuccess,
}: {
  open: boolean; onOpenChange: (v: boolean) => void; item: any; onSuccess?: () => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<string>("UNPAID");
  const [adminUpdatePayment, { isLoading }] = useAdminUpdatePaymentMutation();

  const { register, handleSubmit, formState: { errors }, reset, setValue } =
    useForm<UpdatePaymentFormValues>({ resolver: zodResolver(updatePaymentSchema) as any });

  useEffect(() => {
    if (open && item) {
      const status = item.status ?? "UNPAID";
      setSelectedStatus(status);
      reset({ status, invoiceUrl: item.invoiceUrl ?? "" });
    }
  }, [open, item, reset]);

  const onSubmit = async (data: UpdatePaymentFormValues) => {
    try {
      const payload: any = { status: data.status };
      if (data.invoiceUrl) payload.invoiceUrl = data.invoiceUrl;
      await adminUpdatePayment({ id: item._id, data: payload }).unwrap();
      toast.success("Payment updated successfully!");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update payment");
    }
  };

  const enrollment = item?.enrollment;

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onOpenChange(false); }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="flex flex-col items-center gap-2 pb-2">
          <DialogTitle className="text-xl font-bold tracking-widest uppercase">Edit Payment</DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            Update payment status — enrollment will sync automatically
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Transaction ID</span>
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300">{item?.transactionId ?? "—"}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Amount</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">৳ {item?.amount?.toLocaleString() ?? "—"}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Enrollment Status</span>
            {enrollment?.status ? <StatusBadge status={enrollment.status} /> : <span className="text-xs text-slate-500">—</span>}
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">Update Details</p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold tracking-widest uppercase">
                  Payment Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(v) => { if (!v) return; setSelectedStatus(v); setValue("status", v as any, { shouldValidate: true }); }}
                >
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNPAID">Unpaid</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-xs text-red-400">{errors.status.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-invoice" className="text-xs font-semibold tracking-widest uppercase">
                  Invoice URL <span className="text-[#96999A] normal-case font-normal">(optional)</span>
                </Label>
                <Input id="p-invoice" placeholder="https://invoice.example.com/..." {...register("invoiceUrl")} />
                {errors.invoiceUrl && <p className="text-xs text-red-400">{errors.invoiceUrl.message}</p>}
              </div>
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full cursor-pointer font-bold tracking-widest uppercase disabled:opacity-60">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Updating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Update Payment
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function PaymentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [viewingPayment, setViewingPayment] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [deletingPayment, setDeletingPayment] = useState<any | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const analyticsParams = {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useGetAllAnalyticsQuery(analyticsParams);

  const { data, isLoading, refetch } = useGetAllPaymentsQuery({
    searchTerm: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    page,
    limit,
  });
  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();

  // ── Derived analytics ──
  const paymentSummary = analyticsData?.data?.payments?.summary;
  const byStatus = analyticsData?.data?.payments?.byStatus ?? [];

  const getStatusCount = (s: string) => byStatus.find((x: any) => x.status === s)?.count ?? 0;
  const getStatusAmount = (s: string) => byStatus.find((x: any) => x.status === s)?.totalAmount ?? 0;

  const payments: any[] = data?.data ?? [];
  const meta = data?.meta;
  const totalPage = meta?.totalPage || 1;

  const hasActiveFilters = statusFilter !== "all";
  const hasDateFilter = !!(startDate || endDate);

  useEffect(() => { setPage(1); }, [searchTerm, statusFilter]);

  // ── Client-side sort ──
  const sorted = useMemo(() => {
    if (!sortField || !sortDir) return payments;
    return [...payments].sort((a, b) => {
      const valA = a[sortField] ?? "";
      const valB = b[sortField] ?? "";
      const cmp = typeof valA === "number" && typeof valB === "number"
        ? valA - valB
        : String(valA).localeCompare(String(valB));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [payments, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField !== field) { setSortField(field); setSortDir("asc"); return; }
    if (sortDir === "asc") { setSortDir("desc"); return; }
    setSortField(null); setSortDir(null);
  };

  const clearDateFilter = () => { setStartDate(""); setEndDate(""); };

  const openDetailsDialog = (p: any) => { setViewingPayment(p); setIsDetailsOpen(true); };
  const openEditDialog = (p: any) => { setEditingPayment(p); setIsUpdateOpen(true); };
  const openDeleteDialog = (p: any) => { setDeletingPayment(p); setIsDeleteOpen(true); };

  const handleDelete = async () => {
    if (!deletingPayment) return;
    try {
      await deletePayment(deletingPayment._id).unwrap();
      toast.success("Payment deleted successfully");
      setIsDeleteOpen(false);
      setDeletingPayment(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete payment");
    }
  };

  const SortableTh = ({ field, label }: { field: SortField; label: string }) => (
    <TableHead
      className="cursor-pointer select-none whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center hover:text-slate-900 dark:hover:text-white transition-colors">
        {label}
        <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
      </span>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Management"
        description="Monitor and manage all payment transactions"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Payment Management" },
        ]}
      />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date filter */}
        <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400 shrink-0">
            Filter stats by date:
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Input
              type="date"
              className="h-9 w-40 text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-slate-400 text-sm">to</span>
            <Input
              type="date"
              className="h-9 w-40 text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            {hasDateFilter && (
              <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={clearDateFilter} title="Clear date filter">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {isAnalyticsLoading ? (
          Array.from({ length: 8 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            {/* ── Revenue row ── */}
            <StatCard
              label="Total Revenue"
              value={`৳${(paymentSummary?.totalRevenue ?? 0).toLocaleString()}`}
              sub={`${paymentSummary?.totalTransactions ?? 0} transactions · avg ৳${(paymentSummary?.averageOrderValue ?? 0).toLocaleString()}`}
              icon={DollarSign}
              color="emerald"
            />
            <StatCard
              label="Total Refunded"
              value={`৳${(paymentSummary?.totalRefunded ?? 0).toLocaleString()}`}
              sub={`${getStatusCount("REFUNDED")} refund transactions`}
              icon={RotateCcw}
              color="blue"
            />
            <StatCard
              label="Total Pending"
              value={`৳${(paymentSummary?.totalPending ?? 0).toLocaleString()}`}
              sub={`${getStatusCount("UNPAID")} unpaid transactions`}
              icon={Clock}
              color="amber"
            />
            <StatCard
              label="Failed Payments"
              value={getStatusCount("FAILED")}
              sub={`৳${getStatusAmount("FAILED").toLocaleString()} failed amount`}
              icon={XCircle}
              color="red"
            />

            {/* ── Status breakdown row ── */}
            <StatCard
              label="Completed"
              value={getStatusCount("COMPLETED")}
              sub={`৳${getStatusAmount("COMPLETED").toLocaleString()}`}
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              label="Unpaid"
              value={getStatusCount("UNPAID")}
              sub={`৳${getStatusAmount("UNPAID").toLocaleString()}`}
              icon={Clock}
              color="amber"
            />
            <StatCard
              label="Cancelled"
              value={getStatusCount("CANCELLED")}
              sub={`৳${getStatusAmount("CANCELLED").toLocaleString()}`}
              icon={XCircle}
              color="violet"
            />
            <StatCard
              label="Total Payments"
              value={paymentSummary?.totalTransactions ?? 0}
              sub={`৳${(paymentSummary?.totalRevenue ?? 0).toLocaleString()} total amount`}
              icon={TrendingUp}
              color="blue"
            />
          </>
        )}
      </div>

      {/* ── Search + Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by transaction ID..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(String(v))}>
          <SelectTrigger className="w-full sm:w-40 sm:shrink-0 h-9 text-sm">
            <span className="truncate block">
              {statusFilter === "all" ? "All Statuses" : statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="icon" onClick={() => setStatusFilter("all")} title="Clear filters" className="shrink-0">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* ── Active Filter Badge ── */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1.5 pr-1 cursor-pointer" onClick={() => setStatusFilter("all")}>
            Status: {statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()}
            <X className="w-3 h-3" />
          </Badge>
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <SortableTh field="transactionId" label="Transaction ID" />
                <SortableTh field="amount" label="Amount" />
                <SortableTh field="status" label="Payment Status" />
                <TableHead className="whitespace-nowrap">Enrollment Status</TableHead>
                <SortableTh field="createdAt" label="Date" />
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <PaymentRowSkeleton key={i} />)
              ) : sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <CreditCard className="w-12 h-12 mb-4 opacity-30" />
                      {searchTerm || hasActiveFilters ? (
                        <>
                          <p className="text-base font-medium">No results found</p>
                          <p className="text-sm mt-1">Try adjusting your search or filters</p>
                        </>
                      ) : (
                        <>
                          <p className="text-base font-medium">No payments yet</p>
                          <p className="text-sm mt-1">Payments will appear here once students enroll</p>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((payment) => (
                  <TableRow key={payment._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <TableCell>
                      <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                        {payment.transactionId ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        ৳ {payment.amount?.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell>
                      {payment.enrollment?.status
                        ? <StatusBadge status={payment.enrollment.status} />
                        : <span className="text-slate-400 text-xs">—</span>}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {new Date(payment.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1.5 justify-end">
                        <Button variant="outline" size="icon" className="h-8 w-8" title="View details" onClick={() => openDetailsDialog(payment)}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" title="Edit payment" onClick={() => openEditDialog(payment)}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="destructive" size="icon" className="h-8 w-8" title="Delete payment" onClick={() => openDeleteDialog(payment)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Pagination page={page} totalPage={totalPage} onPageChange={setPage} />
        </div>

        {!isLoading && sorted.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{sorted.length}</span>{" "}
              payment{sorted.length !== 1 ? "s" : ""}
              {hasActiveFilters && " (filtered)"}
            </p>
            {totalPage > 1 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Page {page} of {totalPage}
              </p>
            )}
          </div>
        )}
      </div>

      {viewingPayment && (
        <PaymentDetailsModal open={isDetailsOpen} onOpenChange={setIsDetailsOpen} item={viewingPayment} />
      )}

      {editingPayment && (
        <UpdatePaymentModal open={isUpdateOpen} onOpenChange={setIsUpdateOpen} item={editingPayment} onSuccess={refetch} />
      )}

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete transaction{" "}
              <strong className="font-mono">{deletingPayment?.transactionId}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}