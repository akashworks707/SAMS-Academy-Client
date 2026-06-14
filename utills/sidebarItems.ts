
import { Users, LayoutDashboardIcon, ToolCase, Video, BookOpen, UserCog, BookMarked, UserPlus, CreditCard, TrendingUp, PlayCircle } from "lucide-react";


export const studentSidebar = [
  {
    title: "Student",
    items: [
      { title: "My Courses", url: "/student/dashboard/courses", icon: BookOpen },
    ],
  },
];

export const teacherSidebar = [
  {
    title: "Teacher Management",
    items: [
      { title: "Dashboard", url: "/teacher/dashboard", icon: LayoutDashboardIcon },
      { title: "Courses", url: "/teacher/dashboard/courses", icon: BookOpen },
    ],
  },
];


export const adminSidebar = [
  {
    title: "Admin Management",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboardIcon,
      },

      {
        title: "Courses",
        url: "/admin/dashboard/courses",
        icon: BookMarked,
      },
      {
        title: "Students",
        url: "/admin/dashboard/students",
        icon: Users,
      },
      {
        title: "Teachers",
        url: "/admin/dashboard/teachers",
        icon: UserCog,
      },

      {
        title: "Enrollments",
        url: "/admin/dashboard/enrollments",
        icon: UserPlus,
      },
      {
        title: "Payments",
        url: "/admin/dashboard/payments",
        icon: CreditCard,
      },
      {
        title: "Classes",
        url: "/admin/dashboard/classes",
        icon: BookOpen,
      },
      {
        title: "Subjects",
        url: "/admin/dashboard/subjects",
        icon: BookMarked,
      },

      {
        title: "Commission",
        url: "/admin/dashboard/commission",
        icon: TrendingUp,
      },
      // {
      //   title: "Recorded Videos",
      //   url: "/admin/dashboard/videos",
      //   icon: PlayCircle,
      // },
    ],
  },
];