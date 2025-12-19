import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher(["/login", "/signup"]);

export default clerkMiddleware(async (auth, req) => {
  // Optimistic check: redirect unauthenticated users to login
  // Actual authorization happens in server components/DAL
  if (!isPublicRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      const url = new URL("/login", req.url);
      return Response.redirect(url);
    }
  }
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

