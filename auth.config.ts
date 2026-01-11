import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/");

            // Exclude public routes
            if (
                nextUrl.pathname.startsWith("/login") ||
                nextUrl.pathname.startsWith("/register") ||
                nextUrl.pathname.startsWith("/api") ||
                nextUrl.pathname.startsWith("/_next") ||
                nextUrl.pathname.includes(".") // static files
            ) {
                if (isLoggedIn && (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register"))) {
                    return Response.redirect(new URL("/", nextUrl));
                }
                return true;
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
