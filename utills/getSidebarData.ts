import { adminSidebar, studentSidebar, TEACHERSidebar } from "./sidebarItems";

export const getSidebarData = (role: "STUDENT" | "TEACHER" | "ADMIN") => {
  if (role === "ADMIN") {
    return adminSidebar;
  }
  if (role === "TEACHER") {
    return TEACHERSidebar;
  }

  if (role === "STUDENT") {
    return studentSidebar;
  }
};