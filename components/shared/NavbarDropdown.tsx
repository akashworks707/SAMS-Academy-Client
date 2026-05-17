"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Shield, UserCircle } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserType = {
  _id: string;
  name?: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  picture?: string;
};

interface NavbarDropdownProps {
  user: UserType;
  onLogout: () => void;
}

export function NavbarDropdown({ user, onLogout }: NavbarDropdownProps) {
  const router = useRouter();

  const dashboardRoute =
    user.role === "STUDENT"
      ? "/admin/courses"
      : user.role === "TEACHER"
        ? "/admin/dashboard"
        : "/admin/dashboard";

  const handleLogout = async () => {
    await onLogout();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button
          className="
            relative h-11 w-11 overflow-hidden rounded-full
            border-2 border-emerald-500/20
            hover:border-emerald-500/50
            transition-all duration-200
            cursor-pointer
            focus:outline-none
          "
        >
          {user.picture ? (
            <Image
              src={user.picture}
              alt={user.name || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className="
                flex h-full w-full items-center justify-center
                bg-emerald-100 dark:bg-emerald-900/30
              "
            >
              <UserCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
          w-72 rounded-2xl border
          bg-white dark:bg-slate-900
          border-slate-200 dark:border-slate-800
          shadow-2xl
          p-2
        "
      >
        <div className="px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900 dark:text-white">
                {user.name || "User"}
              </p>

              <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                {user.email}
              </p>

              <div
                className="
                  mt-1 inline-flex items-center gap-1
                  rounded-full bg-emerald-100 dark:bg-emerald-900/30
                  px-2 py-1 text-xs font-medium
                  text-emerald-700 dark:text-emerald-400
                "
              >
                <Shield className="h-3 w-3" />
                {user.role}
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link
            href={dashboardRoute}
            className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-3"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className="
            cursor-pointer rounded-xl px-3 py-3
            text-red-600 focus:text-red-600
          "
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
