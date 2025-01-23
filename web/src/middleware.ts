import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value; // Get the access token from cookies
  const loginPage = "/auth/login"; // Path for the login page
  const currentPath = req.nextUrl.pathname;

  // If the user is logged in (token exists)
  if (token) {
    // If the user tries to access the login page, redirect them to the dashboard or previous page
    if (currentPath === loginPage) {
      const referer = req.headers.get("referer") || "/dashboard"; // Default to "/dashboard" if no referer is available
      return NextResponse.redirect(new URL(referer, req.url));
    }

    // If the user is logged in, allow access to other pages (no need to restrict them)
    return NextResponse.next();
  }

  // If the user is not logged in and trying to access protected routes, redirect to login page
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  if (protectedRoutes.some((route) => currentPath.startsWith(route))) {
    const loginUrl = new URL(loginPage, req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access if none of the conditions match
  return NextResponse.next();
}

// Specify the routes where the middleware will run
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/auth/login",
  ],
};
