// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import React, { useState, useEffect } from "react";
// import { useTranslations } from "next-intl";
// import { Plus, Users, DollarSign, TrendingUp, Percent } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { DataTable } from "@/components/table/data-table";
// import { PageHeader } from "@/components/layout/page-header";
// import { FilterCard, FilterField } from "@/components/filter/filter-card";
// import { StatusBadge } from "@/components/badges/status-badge";
// import { CommissionService } from "@/lib/services/data-service";
// import type { Commission } from "@/types";

// export default function CommissionManagement() {
//   const t = useTranslations();
//   const [commissions, setCommissions] = useState<Commission[]>([]);
//   const [filteredCommissions, setFilteredCommissions] = useState<Commission[]>(
//     [],
//   );
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState<Record<string, any>>({});

//   // Load commissions
//   useEffect(() => {
//     const loadCommissions = async () => {
//       setLoading(true);
//       try {
//         const data = await CommissionService.getAll();
//         setCommissions(data);
//         setFilteredCommissions(data);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadCommissions();
//   }, []);

//   // Apply filters
//   useEffect(() => {
//     let result = [...commissions];

//     if (filters.name) {
//       result = result.filter((c) =>
//         c.name.toLowerCase().includes(filters.name.toLowerCase()),
//       );
//     }

//     if (filters.status && filters.status !== "") {
//       result = result.filter((c) => c.status === filters.status);
//     }

//     setTimeout(() => {
//         setFilteredCommissions(result);
//     }, 100);
//   }, [filters, commissions]);

//   // Calculate statistics
//   const stats = {
//     totalMarketers: commissions.length,
//     totalSales: commissions.reduce((sum, c) => sum + (c.totalSales || 0), 0),
//     totalEarned: commissions.reduce((sum, c) => sum + c.amount, 0),
//     totalPremium: commissions
//       .filter((c) => c.status === "active")
//       .reduce((sum, c) => sum + c.amount, 0),
//   };

//   const filterFields: FilterField[] = [
//     {
//       id: "name",
//       label: "মার্কেটার নাম",
//       type: "text",
//       placeholder: "নাম অনুসন্ধান করুন...",
//     },
//     {
//       id: "status",
//       label: "স্ট্যাটাস",
//       type: "select",
//       options: [
//         { value: "active", label: "সক্রিয়" },
//         { value: "pending", label: "অপেক্ষমাণ" },
//         { value: "inactive", label: "নিষ্ক্রিয়" },
//       ],
//     },
//     {
//       id: "commissionRange",
//       label: "কমিশন হার",
//       type: "text",
//       placeholder: "হার অনুসন্ধান করুন...",
//     },
//     {
//       id: "dateRange",
//       label: "তারিখ পরিসীমা",
//       type: "date-range",
//     },
//   ];

//   const columns: any = [
//     { key: "id" as const, label: "ক্রমিক", width: "8%" },
//     {
//       key: "name" as const,
//       label: "মার্কেটার নাম",
//       width: "15%",
//     },
//     {
//       key: "contactInfo" as const,
//       label: "যোগাযোগ",
//       width: "15%",
//     },
//     {
//       key: "amount" as const,
//       label: "কমিশন পরিমাণ",
//       width: "12%",
//       render: (value: number) => `৳${value.toLocaleString("bn-BD")}`,
//     },
//     {
//       key: "commissionRate" as const,
//       label: "কমিশন হার",
//       width: "10%",
//       render: (value: number) => `${value}%`,
//     },
//     {
//       key: "date" as const,
//       label: "তারিখ",
//       width: "12%",
//     },
//     {
//       key: "status" as const,
//       label: "স্ট্যাটাস",
//       width: "12%",
//       render: (value: string) => {
//         const statusMap: Record<
//           string,
//           { status: "active" | "pending" | "inactive"; label: string }
//         > = {
//           active: { status: "active", label: "সক্রিয়" },
//           pending: { status: "pending", label: "অপেক্ষমাণ" },
//           inactive: { status: "inactive", label: "নিষ্ক্রিয়" },
//         };
//         const s = statusMap[value] || statusMap.pending;
//         return <StatusBadge status={s.status} label={s.label} />;
//       },
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="মার্কেটিং কমিশন"
//         description="সকল মার্কেটিং কমিশন তথ্য পরিচালনা করুন"
//         breadcrumbs={[
//           { label: "ড্যাশবোর্ড", href: "/bn/dashboard" },
//           { label: "মার্কেটিং কমিশন" },
//         ]}
//         action={
//           <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
//             <Plus className="w-4 h-4" />
//             নতুন কমিশন
//           </Button>
//         }
//       />

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card className="bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800">
//           <CardHeader className="pb-3">
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 মোট মার্কেটার
//               </CardTitle>
//               <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
//                 <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold text-gray-900 dark:text-white">
//               {stats.totalMarketers}
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800">
//           <CardHeader className="pb-3">
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 মোট বিক্রয়
//               </CardTitle>
//               <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
//                 <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold text-gray-900 dark:text-white">
//               ৳{(stats.totalSales / 100000).toFixed(1)}L
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800">
//           <CardHeader className="pb-3">
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 মোট আয়
//               </CardTitle>
//               <div className="p-2 bg-amber-100 dark:bg-amber-950 rounded-lg">
//                 <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold text-gray-900 dark:text-white">
//               ৳{(stats.totalEarned / 100000).toFixed(1)}L
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800">
//           <CardHeader className="pb-3">
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 মোট প্রিমিয়াম
//               </CardTitle>
//               <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
//                 <Percent className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold text-gray-900 dark:text-white">
//               ৳{(stats.totalPremium / 100000).toFixed(1)}L
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters */}
//       <FilterCard
//         fields={filterFields}
//         onFilterChange={setFilters}
//         onReset={() => {
//           setFilters({});
//           setFilteredCommissions(commissions);
//         }}
//       />

//       {/* Data Table */}
//       <DataTable
//         columns={columns}
//         data={filteredCommissions}
//         pageSize={10}
//         title="মার্কেটিং কমিশন তালিকা"
//       />
//     </div>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

export default function CommissionManagement() {

  return (
    <div className="space-y-6">
      Commission Page
    </div>
  );
}
