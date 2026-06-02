// export type UserRole = "ADMIN" | "EDITOR";
export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};


export const studentRoutes: RouteConfig = {
  exact: ["/student/dashboard"],
  patterns: [/^\/student/],
};

export const teacherRoutes: RouteConfig = {
  exact: ["/teacher/dashboard"],
  patterns: [/^\/teacher\/dashboard/],
};

export const adminRoutes: RouteConfig = {
  exact: ["/admin/dashboard"],
  patterns: [/^\/admin\/dashboard/],
};


export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig
): boolean => {
  if (routes.exact.includes(pathname)) return true;
  return routes.patterns.some((pattern) => pattern.test(pathname));
};

export const getRouteOwner = (
  pathname: string
): UserRole | null => {

  if (isRouteMatches(pathname, adminRoutes)) {
    return "ADMIN";
  }

  if (isRouteMatches(pathname, teacherRoutes)) {
    return "TEACHER";
  }

  if (isRouteMatches(pathname, studentRoutes)) {
    return "STUDENT";
  }

  return null;
};

export const isValidRouteForRole = (
  pathname: string,
  role: UserRole
): boolean => {
  const routeOwner = getRouteOwner(pathname);

  // Public route
  if (routeOwner === null) return true;

  if (routeOwner === "STUDENT") {
    return role === "STUDENT";
  }

  if (routeOwner === "TEACHER") {
    return role === "TEACHER" || role === "ADMIN";
  }

  if (routeOwner === "ADMIN") {
    return role === "ADMIN";
  }

  return false;
};


export const getDefaultDashboardRoute = (
  role: UserRole
): string => {
  if (role === "STUDENT") return "/student/dashboard";
  if (role === "TEACHER") return "/teacher/dashboard";
  if (role === "ADMIN") return "/admin/dashboard";
  return "/";
};
