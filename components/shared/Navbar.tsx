"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "../theme/mode-toggle";
import { NavbarDropdown } from "./NavbarDropdown";
import { useUser } from "@/context/UserContext";

const navLinks = [
  { label: "হোম", href: "/" },
  { label: "আমাদের সম্পর্কে", href: "/about" },
  { label: "কোর্সসমূহ", href: "/courses" },
  { label: "ক্লাসসমূহ", href: "/classes" },
  { label: "বিষয়সমূহ", href: "/subjects" },
  { label: "যোগাযোগ করুন", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout } = useUser();
  return (
    <header
      className="
    sticky top-0 z-50 w-full
    border-b border-slate-200/80 dark:border-slate-800
    bg-white/90 dark:bg-slate-950/85
    backdrop-blur-xl
    shadow-sm dark:shadow-black/20
    transition-colors duration-300
  "
    >
      <div className="mx-auto flex h-17.5 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="hover:cursor-pointer flex items-center gap-3 shrink-0"
        >
          <div className="relative h-24 w-48 overflow-hidden">
            <Image
              src="/logos/sams-logo-bn.jpeg"
              alt="SAMS Academy Logo"
              fill
              className="object-contain w-full h-full"
              priority
            />
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-[15px] font-medium transition-colors duration-200",
                  "hover:text-[#0E8F3B] dark:hover:text-emerald-400",
                  active
                    ? "text-[#0E8F3B] dark:text-emerald-400"
                    : "text-slate-700 dark:text-slate-300",
                )}
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-0 -bottom-px h-[2.5px] rounded-full bg-[#0E8F3B]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {/* Bell */}
          <div>
            <ModeToggle />
          </div>
          <button
            className="relative p-2 text-slate-500 hover:text-slate-700
dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <Bell className="h-5 w-5 " />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-1 ring-white dark:ring-slate-950" />
          </button>

          {user ? (
            <>
            <NavbarDropdown user={user} onLogout={logout} />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  className="hover:cursor-pointer h-9 rounded-md bg-[#0E8F3B] px-5 text-sm font-semibold text-white hover:bg-[#0a7a32] transition-colors"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  লগ ইন
                </Button>
              </Link>

              <Link href="/signup">
                <Button
                  variant="outline"
                  className="hover:cursor-pointer h-9 rounded-md border-[#0E8F3B] px-5 text-sm font-semibold text-[#0E8F3B] hover:bg-[#0E8F3B]/5 transition-colors"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  রেজিস্ট্রেশন করুন
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button className="relative p-2 text-gray-500">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-1 ring-white" />
          </button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger>
              <Button
                size="icon"
                variant="ghost"
                className="
                rounded-xl
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
               "
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="
              w-72 p-0
              bg-white dark:bg-slate-950
              border-l border-slate-200 dark:border-slate-800
            "
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-3 border-b px-5">
                  <Link href="/" className="flex items-center mx-auto gap-3 shrink-0">
                    <div
                      className="
                relative h-24 w-48 overflow-hidden
                rounded-xl
                transition-transform duration-300
                hover:scale-[1.02]
              "
                    >
                      <Image
                        src="/logos/sams-logo-bn.jpeg"
                        alt="SAMS Academy Logo"
                        fill
                        className="object-contain w-full h-full"
                        priority
                      />
                    </div>
                  </Link>
                </div>

                <nav className="flex flex-col gap-1 p-4">
                  {navLinks.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "rounded-lg px-4 py-3 text-sm font-medium transition-all",
                          active
                            ? "bg-[#0E8F3B]/10 text-[#0E8F3B] dark:bg-emerald-500/15 dark:text-emerald-400"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
                        )}
                        style={{
                          fontFamily: "'Noto Sans Bengali', sans-serif",
                        }}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-auto border-t p-4 flex flex-col gap-2">
                  {user ? (
                    <div className="flex flex-col gap-2">
                      <Link
                        href={
                          user.role === "STUDENT"
                            ? "/student/dashboard/my-courses"
                            : "/staff/dashboard"
                        }
                        onClick={() => setMobileOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 rounded-xl"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>

                      <Button
                        variant="destructive"
                        className="w-full justify-start gap-2 rounded-xl"
                        onClick={async () => {
                          setMobileOpen(false);
                          await logout();
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button
                          className="hover:cursor-pointer w-full bg-[#0E8F3B] text-white hover:bg-[#0a7a32]"
                          style={{
                            fontFamily: "'Noto Sans Bengali', sans-serif",
                          }}
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          লগ ইন
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setMobileOpen(false)}>
                        <Button
                          variant="outline"
                          className="hover:cursor-pointer w-full border-[#0E8F3B] text-[#0E8F3B]"
                          style={{
                            fontFamily: "'Noto Sans Bengali', sans-serif",
                          }}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          রেজিস্ট্রেশন করুন
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
