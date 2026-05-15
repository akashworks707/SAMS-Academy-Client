import React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import ReduxProvider from "@/providers/ReduxProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <MainLayout>{children}</MainLayout>
    </ReduxProvider>
  );
}
