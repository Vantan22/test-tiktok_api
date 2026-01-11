import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            // Public routes that don't require authentication
            const publicPaths = ["/login", "/register"];
            const isPublicPath = publicPaths.some(path => nextUrl.pathname.startsWith(path));

            // API routes and static files always allowed
            if (
                nextUrl.pathname.startsWith("/api") ||
                nextUrl.pathname.startsWith("/_next") ||
                nextUrl.pathname.includes(".")
            ) {
                return true;
            }

            // If user is logged in and tries to access login/register, redirect to home
            if (isLoggedIn && isPublicPath) {
                return Response.redirect(new URL("/", nextUrl));
            }

            // If not logged in and trying to access protected route, redirect to login
            if (!isLoggedIn && !isPublicPath) {
                return Response.redirect(new URL("/login", nextUrl));
            }

            // Allow access
            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
