import { Users, LayoutDashboardIcon, ToolCase, Video, BookOpen, UserCog } from "lucide-react";

export const studentSidebar = [
  {
    title: "Student",
    items: [
      { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboardIcon },
      { title: "My Courses", url: "/student/dashboard/my-courses", icon: ToolCase },
      { title: "Live Class", url: "/student/dashboard/live-class", icon: Video }
    ],
  }
];

export const adminSidebar = [
  {
    title: "Admin Management",
    items: [
      { title: "Dashboard", url: "/staff/dashboard", icon: LayoutDashboardIcon },
      { title: "Courses", url: "/staff/dashboard/courses", icon: BookOpen },
      { title: "Live Class", url: "/staff/dashboard/live-class", icon: Video },
      { title: "TEACHERs", url: "/staff/dashboard/TEACHERs", icon: UserCog },
      { title: "Students", url: "/staff/dashboard/students", icon: Users },
    ],
  }
];

export const TEACHERSidebar = [
  {
    title: "TEACHER Management",
    items: [
      { title: "Dashboard", url: "/staff/dashboard", icon: LayoutDashboardIcon },
      { title: "Courses", url: "/staff/dashboard/courses", icon: BookOpen },
      { title: "Live Class", url: "/staff/dashboard/live-class", icon: Video },
      { title: "TEACHERs", url: "/staff/dashboard/TEACHERs", icon: UserCog },
      { title: "Students", url: "/staff/dashboard/students", icon: Users },
    ],
  }
];

