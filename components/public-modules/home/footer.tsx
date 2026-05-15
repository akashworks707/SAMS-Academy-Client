"use client";

import Link from "next/link";

import { Mail, Phone, MapPin, GraduationCap, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M22 12.07C22 6.477 17.523 2 12 2S2 6.477 2 12.07c0 5.052 3.657 9.24 8.438 10v-7.03H7.898v-2.97h2.54V9.845c0-2.52 1.492-3.913 3.777-3.913 1.094 0 2.238.196 2.238.196v2.475h-1.26c-1.243 0-1.63.774-1.63 1.567v1.88h2.773l-.443 2.97h-2.33v7.03C18.343 21.31 22 17.122 22 12.07z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm8.37 1.5H7.88A4.38 4.38 0 0 0 3.5 7.88v8.24a4.38 4.38 0 0 0 4.38 4.38h8.24a4.38 4.38 0 0 0 4.38-4.38V7.88a4.38 4.38 0 0 0-4.38-4.38zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5zm5.25-2a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M21.58 7.19a2.77 2.77 0 0 0-1.95-1.96C17.9 4.75 12 4.75 12 4.75s-5.9 0-7.63.48A2.77 2.77 0 0 0 2.42 7.2C1.94 8.92 1.94 12 1.94 12s0 3.08.48 4.8a2.77 2.77 0 0 0 1.95 1.96c1.73.48 7.63.48 7.63.48s5.9 0 7.63-.48a2.77 2.77 0 0 0 1.95-1.96c.48-1.72.48-4.8.48-4.8s0-3.08-.48-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
  </svg>
);

// ── Theme Toggle ────────────────────────────────────────
// function ModeToggle() {
//   const { setTheme, theme } = useTheme();

//   return (
//     <Button
//       variant="outline"
//       size="icon"
//       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//       className="rounded-full border-border bg-background/80 backdrop-blur"
//     >
//       <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />

//       <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-yellow-300" />
//     </Button>
//   );
// }

// ── Footer ──────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background transition-colors duration-500">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16">
        {/* Top */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-orange-500 shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>

              <div>
                <h2 className="text-xl font-black text-foreground">EduVerse</h2>

                <p className="text-sm text-muted-foreground">
                  Smart Learning Platform
                </p>
              </div>
            </div>

            <p className="mb-6 leading-relaxed text-muted-foreground">
              বাংলাদেশের শিক্ষার্থীদের জন্য আধুনিক অনলাইন লার্নিং প্ল্যাটফর্ম।
              ক্লাস ৬ থেকে ১২ পর্যন্ত সম্পূর্ণ প্রস্তুতি।
            </p>

            <div className="flex items-center gap-3">
              <Button size="icon" variant="outline" className="rounded-full">
                <FacebookIcon className="h-4 w-4" />
              </Button>

              <Button size="icon" variant="outline" className="rounded-full">
                <InstagramIcon className="h-4 w-4" />
              </Button>

              <Button size="icon" variant="outline" className="rounded-full">
                <YoutubeIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-foreground">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {["Home", "Courses", "Teachers", "About Us", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="group flex items-center text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ArrowRight className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />

                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-foreground">Contact</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-orange-400" />

                <p className="text-sm text-muted-foreground">
                  Dhaka, Bangladesh
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-sky-400" />

                <p className="text-sm text-muted-foreground">
                  +880 1234-567890
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-400" />

                <p className="text-sm text-muted-foreground">
                  support@eduverse.com
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Newsletter</h3>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">
              Get updates about new courses and live classes.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 EduVerse. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>

            <Link href="#" className="transition-colors hover:text-foreground">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
