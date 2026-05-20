/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "@/i18n/routing";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BookMarked,
  UserCheck,
  CreditCard,
  TrendingUp,
  X,
  UserPlus,
  PlayCircle,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

interface NavItem {
  key: string;
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const SidebarContext = React.createContext<
  SidebarContextType | undefined
>(undefined);

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};

const SidebarLogo = () => {
  const locale = useLocale();
  const isBangla = locale === "bn";

  return (
    <div className="border-b border-slate-700">
      <Link href="/" className="block">
        <div className="relative overflow-hidden bg-linear-to-br from-slate-800 via-slate-700 to-slate-800 border border-slate-600 shadow-xl group">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 group-hover:opacity-100 opacity-0 transition-opacity duration-300" />

          <Image
            src={
              isBangla ? "/logos/sams-logo-bn.jpeg" : "/logos/sams-logo-en.jpeg"
            }
            alt="School Logo"
            width={600}
            height={200}
            priority
            quality={100}
            className="w-full h-20 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
    </div>
  );
};

const NavItems = () => {
  const t = useTranslations();
  const pathname = usePathname();

  const items: NavItem[] = [
    {
      key: "dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: t("dashboard"),
    },
    {
      key: "classes",
      href: "/admin/classes",
      icon: <BookOpen className="w-5 h-5" />,
      label: t("classes"),
    },
    {
      key: "courses",
      href: "/admin/courses",
      icon: <BookMarked className="w-5 h-5" />,
      label: t("courses"),
    },
    {
      key: "subjects",
      href: "/admin/subjects",
      icon: <BookMarked className="w-5 h-5" />,
      label: t("subjects"),
    },
    {
      key: "teachers",
      href: "/admin/teachers",
      icon: <Users className="w-5 h-5" />,
      label: t("teachers"),
    },
    {
      key: "students",
      href: "/admin/students",
      icon: <UserCheck className="w-5 h-5" />,
      label: t("students"),
    },
    {
      key: "enrollments",
      href: "/admin/enrollments",
      icon: <UserPlus className="w-5 h-5" />,
      label: t("enrollments"),
    },
    {
      key: "payments",
      href: "/admin/payments",
      icon: <CreditCard className="w-5 h-5" />,
      label: t("student_payments"),
    },
    {
      key: "commission",
      href: "/admin/commission",
      icon: <TrendingUp className="w-5 h-5" />,
      label: t("marketing_commission"),
    },
    {
      key: "videos",
      href: "/admin/videos",
      icon: <PlayCircle className="w-5 h-5" />,
      label: t("recorded_videos"),
    },
    {
      key: "zoom",
      href: "/admin/zoom",
      icon: <Video className="w-5 h-5" />,
      label: t("zoom_meetings"),
    },
  ];

  return (
    <nav className="flex-1 px-4 py-6 space-y-2">
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname?.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50",
            )}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const ProfileCard = () => {
  const t = useTranslations();
  return (
    <div className="p-4 border-t border-slate-700">
      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-600" />
        <div className="text-left flex-1">
          <div className="text-sm font-semibold text-white">অ্যাডমিন</div>
          <div className="text-xs text-slate-400">রাশেদুল</div>
        </div>
      </button>
    </div>
  );
};

const SidebarContent = () => {
  return (
    <>
    <SidebarLogo />
    <ScrollArea className="max-h-[75vh]">
      <NavItems />
      <ScrollBar orientation="vertical" />
    </ScrollArea>
      <ProfileCard />
      </>
  );
};

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export const Sidebar = ({ isOpen = false, setIsOpen }: SidebarProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="left"
          className="w-56 p-0 bg-slate-900 border-slate-700"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-56 bg-slate-900 border-r border-slate-700 flex-col z-40">
      <SidebarContent />
    </aside>
  );
};
