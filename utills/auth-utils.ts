// export type UserRole = "ADMIN" | "EDITOR";
export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};


export const studentRoutes: RouteConfig = {
  exact: ["/student/dashboard"],
  patterns: [/^\/student\/dashboard/],
};

export const TEACHERRoutes: RouteConfig = {
  exact: ["/staff/dashboard"],
  patterns: [/^\/staff\/dashboard(?!\/owner)/],
};

export const adminRoutes: RouteConfig = {
  exact: ["/staff/dashboard/admin"],
  patterns: [/^\/staff\/dashboard\/admin/],
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
): UserRole | "TEACHER" | null => {

  if (isRouteMatches(pathname, adminRoutes)) {
    return "ADMIN";
  }

  if (isRouteMatches(pathname, TEACHERRoutes)) {
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
  if (role === "TEACHER") return "/staff/dashboard";
  if (role === "ADMIN") return "/staff/dashboard";
  return "/";
};
