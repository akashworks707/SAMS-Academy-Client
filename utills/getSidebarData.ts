// import { adminSidebar, studentSidebar, teacherSidebar } from "./sidebarItems";

// export const getSidebarData = (role: "STUDENT" | "TEACHER" | "ADMIN") => {
//   if (role === "ADMIN") {
//     return adminSidebar;
//   }
//   if (role === "TEACHER") {
//     return teacherSidebar;
//   }

//   if (role === "STUDENT") {
//     return studentSidebar;
//   }
// };

import { UserRole } from "./auth-utils";
import { adminSidebar, studentSidebar, teacherSidebar } from "./sidebarItems";
export const getSidebarData = (role: UserRole) => {
  switch (role) {
    case "ADMIN":
      return adminSidebar;
    case "TEACHER":
      return teacherSidebar;
    case "STUDENT":
      return studentSidebar;
    default:
      return [];
  }
};