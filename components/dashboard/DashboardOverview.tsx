/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Users,
  BookOpen,
  UserCheck,
  BookMarked,
  Wallet,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { DataTable } from "@/components/table/data-table";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  dummyClasses,
  dummyPayments,
  paymentChartData,
  subjectDistributionData,
  getDashboardStats,
} from "@/lib/dummy-data";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#6366F1",
];

const getBengaliDate = () => {
  const formatter = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formatter.format(new Date());
};

export default function DashboardOverview() {
  const t = useTranslations();
  const [stats, setStats] = useState(getDashboardStats());

  const statCards = [
    {
      title: t("total_students"),
      value: stats.totalStudents,
      icon: <Users className="w-6 h-6" />,
      trend: stats.studentTrend,
      trendDirection: "up" as const,
      color: "blue" as const,
      description: "মোটো ছাত্র সংখ্যা",
    },
    {
      title: t("total_classes"),
      value: stats.totalClasses,
      icon: <BookOpen className="w-6 h-6" />,
      trend: stats.classTrend,
      trendDirection: "up" as const,
      color: "green" as const,
      description: "মোট ক্লাস সংখ্যা",
    },
    {
      title: t("total_teachers"),
      value: stats.totalTeachers,
      icon: <UserCheck className="w-6 h-6" />,
      trend: stats.teacherTrend,
      trendDirection: "up" as const,
      color: "purple" as const,
      description: "মোট শিক্ষক সংখ্যা",
    },
    {
      title: t("total_subjects"),
      value: stats.totalSubjects,
      icon: <BookMarked className="w-6 h-6" />,
      trend: stats.subjectTrend,
      trendDirection: "up" as const,
      color: "orange" as const,
      description: "মোট বিষয় সংখ্যা",
    },
    {
      title: t("total_payments"),
      value: stats.totalPayments,
      icon: <Wallet className="w-6 h-6" />,
      trend: stats.paymentTrend,
      trendDirection: "up" as const,
      color: "red" as const,
      description: "মোট পেমেন্ট পরিমাণ",
      format: "currency",
    },
    {
      title: t("total_commission"),
      value: stats.totalCommission,
      icon: <TrendingUp className="w-6 h-6" />,
      trend: stats.commissionTrend,
      trendDirection: "up" as const,
      color: "pink" as const,
      description: "মোট মার্কেটিং কমিশন",
      format: "currency",
    },
  ];

  const classColumns = [
    {
      key: "code" as const,
      label: "ক্লাস কোড",
    },
    {
      key: "name" as const,
      label: "ক্লাসের নাম",
    },
    {
      key: "classTeacher" as const,
      label: "ক্লাস শিক্ষক",
    },
    {
      key: "totalStudents" as const,
      label: "মোট ছাত্র",
    },
    {
      key: "status" as const,
      label: "অবস্থা",
      render: (value: string) => (
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
          {value === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
        </span>
      ),
    },
  ];

  const paymentColumns = [
    {
      key: "id" as const,
      label: "পেমেন্ট আইডি",
    },
    {
      key: "studentName" as const,
      label: "ছাত্রের নাম",
    },
    {
      key: "amount" as const,
      label: "পরিমাণ",
      render: (value: number) => `৳ ${value.toLocaleString("bn-BD")}`,
    },
    {
      key: "date" as const,
      label: "তারিখ",
    },
    {
      key: "status" as const,
      label: "অবস্থা",
      render: (value: string) => {
        const statusMap = {
          completed: {
            bg: "bg-green-100 dark:bg-green-900",
            text: "text-green-700 dark:text-green-300",
            label: "সম্পন্ন",
          },
          pending: {
            bg: "bg-yellow-100 dark:bg-yellow-900",
            text: "text-yellow-700 dark:text-yellow-300",
            label: "অপেক্ষমাণ",
          },
          failed: {
            bg: "bg-red-100 dark:bg-red-900",
            text: "text-red-700 dark:text-red-300",
            label: "ব্যর্থ",
          },
        };
        const status =
          statusMap[value as keyof typeof statusMap] || statusMap.pending;
        return (
          <span
            className={`px-3 py-1 ${status.bg} ${status.text} text-xs font-medium rounded-full`}
          >
            {status.label}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {t("welcome")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {getBengaliDate()}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card: any, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
            trendDirection={card.trendDirection}
            color={card.color}
            description={card.description}
            format={card?.format || ""}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Statistics Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            {t("payment_statistics")}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={paymentChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148, 163, 184, 0.1)"
              />
              <XAxis
                dataKey="date"
                stroke="rgba(148, 163, 184, 0.5)"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="rgba(148, 163, 184, 0.5)"
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
                name="পেমেন্ট মূল্য"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Distribution Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            {t("subject_distribution")}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {subjectDistributionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          columns={classColumns}
          data={dummyClasses.slice(0, 4)}
          pageSize={10}
          title={t("recent_classes")}
          searchable={false}
        />
        <DataTable
          columns={paymentColumns}
          data={dummyPayments}
          pageSize={10}
          title={t("student_payments_table")}
          searchable={false}
        />
      </div>
    </div>
  );
}
