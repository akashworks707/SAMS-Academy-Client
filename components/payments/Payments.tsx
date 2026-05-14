/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Users, DollarSign, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { FilterCard, FilterField } from "@/components/filter/filter-card";
import { StatusBadge } from "@/components/badges/status-badge";
import { PaymentService } from "@/lib/services/data-service";
import type { Payment } from "@/types";

export default function Payments() {
  const t = useTranslations();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Load payments
  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        const data = await PaymentService.getAll();
        setPayments(data);
        setFilteredPayments(data);
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...payments];

    if (filters.studentName) {
      result = result.filter((p) =>
        p.studentName.toLowerCase().includes(filters.studentName.toLowerCase()),
      );
    }

    if (filters.status && filters.status !== "") {
      result = result.filter((p) => p.status === filters.status);
    }

    if (filters.type && filters.type !== "") {
      result = result.filter((p) => p.type === filters.type);
    }

    setTimeout(() => {
      setFilteredPayments(result);
    }, 100);
  }, [filters, payments]);

  // Calculate statistics
  const stats = {
    totalStudents: new Set(payments.map((p) => p.studentName)).size,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    totalFee: payments
      .filter((p) => p.type === "tuition")
      .reduce((sum, p) => sum + p.amount, 0),
    totalOther: payments
      .filter((p) => p.type !== "tuition")
      .reduce((sum, p) => sum + p.amount, 0),
  };

  const filterFields: FilterField[] = [
    {
      id: "studentName",
      label: "শিক্ষার্থীর নাম",
      type: "text",
      placeholder: "নাম অনুসন্ধান করুন...",
    },
    {
      id: "type",
      label: "পেমেন্ট ধরন",
      type: "select",
      options: [
        { value: "tuition", label: "টিউশন" },
        { value: "activity", label: "কার্যক্রম" },
        { value: "other", label: "অন্যান্য" },
      ],
    },
    {
      id: "status",
      label: "স্ট্যাটাস",
      type: "select",
      options: [
        { value: "completed", label: "সম্পন্ন" },
        { value: "pending", label: "অপেক্ষমাণ" },
        { value: "failed", label: "ব্যর্থ" },
      ],
    },
    {
      id: "dateRange",
      label: "তারিখ পরিসীমা",
      type: "date-range",
    },
  ];

  const columns = [
    { key: "id" as const, label: "পেমেন্ট আইডি", width: "10%" },
    {
      key: "studentName" as const,
      label: "শিক্ষার্থীর নাম",
      width: "15%",
    },
    {
      key: "amount" as const,
      label: "পরিমাণ",
      width: "12%",
      render: (value: number) => `৳${value.toLocaleString("bn-BD")}`,
    },
    {
      key: "type" as const,
      label: "ধরন",
      width: "12%",
      render: (value: string) => {
        const typeMap: Record<string, string> = {
          tuition: "টিউশন",
          activity: "কার্যক্রম",
          other: "অন্যান্য",
        };
        return typeMap[value] || value;
      },
    },
    {
      key: "date" as const,
      label: "তারিখ",
      width: "12%",
    },
    {
      key: "status" as const,
      label: "স্ট্যাটাস",
      width: "15%",
      render: (value: string) => {
        const statusMap: Record<
          string,
          { status: "success" | "pending" | "failed"; label: string }
        > = {
          completed: { status: "success", label: "সম্পন্ন" },
          pending: { status: "pending", label: "অপেক্ষমাণ" },
          failed: { status: "failed", label: "ব্যর্থ" },
        };
        const s = statusMap[value] || statusMap.pending;
        return <StatusBadge status={s.status} label={s.label} />;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="ছাত্র পেমেন্ট"
        description="সকল শিক্ষার্থীর পেমেন্ট তথ্য পরিচালনা করুন"
        breadcrumbs={[
          { label: "ড্যাশবোর্ড", href: "/bn/dashboard" },
          { label: "ছাত্র পেমেন্ট" },
        ]}
        action={
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            নতুন পেমেন্ট
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                মোট ছাত্র
              </CardTitle>
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalStudents}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                মোট পেমেন্ট
              </CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ৳{(stats.totalAmount / 100000).toFixed(1)}L
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                মোট টিউশন
              </CardTitle>
              <div className="p-2 bg-amber-100 dark:bg-amber-950 rounded-lg">
                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ৳{(stats.totalFee / 100000).toFixed(1)}L
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                মোট অন্যান্য
              </CardTitle>
              <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ৳{(stats.totalOther / 100000).toFixed(1)}L
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <FilterCard
        fields={filterFields}
        onFilterChange={setFilters}
        onReset={() => {
          setFilters({});
          setFilteredPayments(payments);
        }}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredPayments}
        pageSize={10}
        title="শিক্ষার্থী পেমেন্ট রেকর্ড"
      />
    </div>
  );
}
