import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const loginPage = "/auth/login";
  const currentPath = req.nextUrl.pathname;

  // List of protected routes (if needed, expand dynamically)
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];

  if (token) {
    // Redirect logged-in users away from login page
    if (currentPath.startsWith(loginPage)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Redirect unauthorized users trying to access protected routes
  if (protectedRoutes.some((route) => currentPath.startsWith(route))) {
    if (currentPath !== loginPage) {
      return NextResponse.redirect(new URL(loginPage, req.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware only to relevant paths
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/auth/login",
  ],
};
