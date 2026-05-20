/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Menu,
  Search,
  Bell,
  Globe,
  Moon,
  Sun,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useGetMeQuery } from "@/redux/features/user/user.api";
import { logoutUser } from "@/utills/logoutUser";
import Image from "next/image";
import { useUser } from "@/context/UserContext";

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === "bn" ? "en" : "bn";

    const currentPath =
      window.location.pathname.replace(/^\/(bn|en)/, "") || "/dashboard";

    router.replace(currentPath, {
      locale: newLocale,
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 lg:left-56 h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-30">
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {searchOpen ? (
          <Input
            placeholder={t("search")}
            className="flex-1 max-w-xs"
            autoFocus
            onBlur={() => setSearchOpen(false)}
          />
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">{t("search")}</span>
          </button>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {pathname?.startsWith("/en") ? "EN" : "BN"}
          </span>
        </button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {user?.picture ? (
                <Image
                  src={user.picture}
                  alt={user.name || "User"}
                  width={36}
                  height={36}
                  priority
                  quality={90}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {user?.name || "User"}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.role}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl"
          >
            {/* User Info */}
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email}
              </p>
            </div>

            <DropdownMenuSeparator />

            {/* Profile */}
            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="cursor-pointer"
            >
              <User className="w-4 h-4 mr-2" />
              {t("profile")}
            </DropdownMenuItem>

            {/* Dashboard */}
            <DropdownMenuItem
              onClick={() => {
                if (user?.role === "ADMIN") {
                  router.push("/admin");
                } else if (user?.role === "TEACHER") {
                  router.push("/admin/teachers");
                } else {
                  router.push("/");
                }
              }}
              className="cursor-pointer"
            >
              <Settings className="w-4 h-4 mr-2" />
              Dashboard
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={async () => {
                await logoutUser();
                router.push("/login");
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
