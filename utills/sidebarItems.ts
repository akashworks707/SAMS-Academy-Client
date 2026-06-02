// import { Users, LayoutDashboardIcon, ToolCase, Video, BookOpen, UserCog } from "lucide-react";

// export const studentSidebar = [
//   {
//     title: "Student",
//     items: [
//       { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboardIcon },
//       { title: "My Courses", url: "/student/dashboard/my-courses", icon: ToolCase },
//       { title: "Live Class", url: "/student/dashboard/live-class", icon: Video }
//     ],
//   }
// ];

// export const adminSidebar = [
//   {
//     title: "Admin Management",
//     items: [
//       { title: "Dashboard", url: "/staff/dashboard", icon: LayoutDashboardIcon },
//       { title: "Courses", url: "/staff/dashboard/courses", icon: BookOpen },
//       { title: "Live Class", url: "/staff/dashboard/live-class", icon: Video },
//       { title: "TEACHERs", url: "/staff/dashboard/TEACHERs", icon: UserCog },
//       { title: "Students", url: "/staff/dashboard/students", icon: Users },
//     ],
//   }
// ];

// export const TEACHERSidebar = [
//   {
//     title: "TEACHER Management",
//     items: [
//       { title: "Dashboard", url: "/staff/dashboard", icon: LayoutDashboardIcon },
//       { title: "Courses", url: "/staff/dashboard/courses", icon: BookOpen },
//       { title: "Live Class", url: "/staff/dashboard/live-class", icon: Video },
//       { title: "TEACHERs", url: "/staff/dashboard/TEACHERs", icon: UserCog },
//       { title: "Students", url: "/staff/dashboard/students", icon: Users },
//     ],
//   }
// ];

import { Users, LayoutDashboardIcon, ToolCase, Video, BookOpen, UserCog, BookMarked, UserPlus, CreditCard, TrendingUp, PlayCircle } from "lucide-react";


export const studentSidebar = [
  {
    title: "Student",
    items: [
      { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboardIcon },
      { title: "My Courses", url: "/student/dashboard/courses", icon: BookOpen },
      { title: "Live Class", url: "/student/dashboard/live-class", icon: Video },
    ],
  },
];

export const teacherSidebar = [
  {
    title: "Teacher Management",
    items: [
      { title: "Dashboard", url: "/teacher/dashboard", icon: LayoutDashboardIcon },
      { title: "Courses", url: "/teacher/dashboard/courses", icon: BookOpen },
      { title: "Live Class", url: "/teacher/dashboard/live-class", icon: Video },
      { title: "Students", url: "/teacher/dashboard/students", icon: Users },
    ],
  },
];

// export const adminSidebar = [
//   {
//     title: "Admin Management",
//     items: [
//       { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboardIcon },
//       { title: "Courses", url: "/admin/dashboard/courses", icon: BookOpen },
//       { title: "Live Class", url: "/admin/dashboard/live-class", icon: Video },
//       { title: "Teachers", url: "/admin/dashboard/teachers", icon: UserCog },
//       { title: "Students", url: "/admin/dashboard/students", icon: Users },
//     ],
//   },
// ];


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
        title: "Classes",
        url: "/admin/dashboard/classes",
        icon: BookOpen,
      },
      {
        title: "Courses",
        url: "/admin/dashboard/courses",
        icon: BookMarked,
      },
      {
        title: "Subjects",
        url: "/admin/dashboard/subjects",
        icon: BookMarked,
      },
      // {
      //   title: "Live Class",
      //   url: "/admin/dashboard/live-class",
      //   icon: Video,
      // },
      {
        title: "Teachers",
        url: "/admin/dashboard/teachers",
        icon: UserCog,
      },
      {
        title: "Students",
        url: "/admin/dashboard/students",
        icon: Users,
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