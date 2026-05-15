/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  LogOut,
  User,
  User2,
  GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavbarDropdown({ user, onLogout }: any) {
  const router = useRouter();

  const handleLogout = async () => {
    await onLogout();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="outline"
          size="icon"
          className="
            h-10 w-10 rounded-full
            border-border
            bg-background
            hover:bg-muted
            transition-all duration-200
            cursor-pointer
          "
        >
          <User className="h-5 w-5 text-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
          w-64 rounded-2xl
          border border-border
          bg-popover
          text-popover-foreground
          shadow-xl
        "
      >
        {/* User Info */}
        <DropdownMenuLabel className="p-4">
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-full bg-primary/10
                text-primary
              "
            >
              <GraduationCap className="h-5 w-5" />
            </div>

            <div className="flex flex-col overflow-hidden">
              <p className="truncate text-sm font-semibold">
                {user?.name || "Student"}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Dashboard */}
        <DropdownMenuGroup className="p-2">
          <DropdownMenuItem
          
            className="
              cursor-pointer rounded-xl
              px-3 py-3
              focus:bg-muted
            "
          >
            <Link
              href={
                user.role === "STUDENT"
                  ? "/student/dashboard/my-courses"
                  : "/staff/dashboard"
              }
            >
              <User2 className="mr-2 h-4 w-4" />

              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <div className="p-2">
          <DropdownMenuItem
            onClick={handleLogout}
            className="
              cursor-pointer rounded-xl
              px-3 py-3
              text-red-500
              focus:bg-red-500/10
              focus:text-red-500
            "
          >
            <LogOut className="mr-2 h-4 w-4" />

            <span>Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}