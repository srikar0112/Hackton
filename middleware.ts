import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const role = req.nextauth.token?.role as string;

        // Admin-only route guard
        if (pathname.startsWith("/admin") && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/navigator/:path*",
        "/dashboard/:path*",
        "/study/:path*",
        "/analytics/:path*",
        "/admin/:path*",
        "/habits/:path*",
        "/resources/:path*",
        "/finder/:path*",
        "/schedule/:path*",
        "/roadmap/:path*",
        "/onboarding/:path*",
    ],
};
