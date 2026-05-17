"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
  textColor?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  bgColor = "bg-blue-50 dark:bg-blue-950",
  textColor = "text-blue-600 dark:text-blue-400",
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "p-6 flex gap-4 items-start hover:shadow-lg transition-shadow",
        className
      )}
    >
      <div
        className={cn(
          "p-3 rounded-lg flex-shrink-0",
          bgColor
        )}
      >
        <div className={cn("h-6 w-6", textColor)}>
          {icon}
        </div>
      </div>
      
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend.isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.value}%
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
