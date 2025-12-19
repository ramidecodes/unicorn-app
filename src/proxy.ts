import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // Protect /play and /profile routes - requires authentication
  if (pathname.startsWith("/play") || pathname.startsWith("/profile")) {
    await auth.protect();
  }

  // If user is authenticated and trying to access login/signup, redirect to play
  if (
    (pathname.startsWith("/login") || pathname.startsWith("/signup")) &&
    userId
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/play";
    return NextResponse.redirect(url);
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  // Homepage "/" and login/signup are public routes, so allow access
  const isLoginOrSignup =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isPublicRoute = pathname === "/";
  if (!isLoginOrSignup && !isPublicRoute && !userId) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Allow request to pass through for all other cases
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
