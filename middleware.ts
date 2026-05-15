import jwt, { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isValidRouteForRole,
  UserRole,
} from "./utills/auth-utils";

export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
const pathname = request.nextUrl.pathname;

const cleanPath = pathname.replace(/^\/(bn|en)(?=\/|$)/, "") || "/";

  const locale = pathname.startsWith("/en") ? "en" : "bn";

  const accessToken = request.cookies.get("accessToken")?.value;

  let userRole: UserRole | null = null;

  if (accessToken) {
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      ) as JwtPayload;

      userRole = decoded.role as UserRole;
    } catch {
      const res = NextResponse.redirect(
        new URL(`/${locale}/login`, request.url)
      );

      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");

      return res;
    }
  }

const routeOwner = getRouteOwner(cleanPath);

  if (routeOwner === null) {
    return NextResponse.next();
  }

  if (!accessToken || !userRole) {
    return NextResponse.redirect(
      new URL(`/${locale}/login`, request.url)
    );
  }

  if (!isValidRouteForRole(cleanPath, userRole)) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};