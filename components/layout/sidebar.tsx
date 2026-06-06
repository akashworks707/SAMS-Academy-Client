/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useUser } from "@/context/UserContext";
import { getSidebarData } from "@/utills/getSidebarData";
import { UserRole } from "@/utills/auth-utils";

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

  return (
    <div className="border-b border-slate-700">
      <Link href="/" className="block">
        <div className="relative overflow-hidden bg-linear-to-br from-slate-800 via-slate-700 to-slate-800 border border-slate-600 shadow-xl group">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 group-hover:opacity-100 opacity-0 transition-opacity duration-300" />

          <Image
            src={"/logos/sams-logo-en.jpeg"}
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
  const pathname = usePathname();
  const { user } = useUser();

  const sidebarGroups = getSidebarData(user?.role as UserRole);

  const accessibleItems =
    sidebarGroups?.flatMap((group) => group.items) ?? [];

  return (
    <nav className="flex-1 px-4 py-6 space-y-2">
      {accessibleItems.map((item) => {
        const isActive =
          pathname === item.url || pathname?.startsWith(`${item.url}/`);

        return (
          <Link
            key={item.title}
            href={item.url}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
};



const DevelopedByCard = () => {
  const t = useTranslations();
  return (
    <Link
      href="https://dotskillsbd.com"
      target="_blank"
    >
      <div className="p-4 border-t border-slate-700 fixed bottom-0 bg-slate-900">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-600">
            <Image
              src={"/logos/dotskills-logo2.png"}
              alt="Profile Avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="text-left flex-1">
            <div className="text-sm font-semibold text-white">Developed By</div>
            <div className="text-xs text-slate-400">Dotskills</div>
          </div>
        </button>
      </div>
    </Link>
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
      <DevelopedByCard />
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
