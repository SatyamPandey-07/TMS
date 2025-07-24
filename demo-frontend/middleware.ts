import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;
    console.log(token);
    
    const { pathname } = req.nextUrl;

    const isPublicPage = ["/", "/login", "/register"].includes(pathname);

    if (!token && !isPublicPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes – allow unauthenticated access
        if (["/", "/login", "/register"].includes(pathname)) {
          return true;
        }

        // All other routes – require token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Exclude _next, images, favicon, public, and API routes
    "/((?!_next/static|_next/image|favicon.ico|public/|api/).*)",
  ],
};