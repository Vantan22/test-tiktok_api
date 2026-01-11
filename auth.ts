import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import TikTok from "next-auth/providers/tiktok";
import { z } from "zod";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        TikTok({
            clientId: process.env.TIKTOK_CLIENT_ID,
            clientSecret: process.env.TIKTOK_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;

                    await connectDB();
                    const user = await User.findOne({ email });
                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user;
                }

                console.log("Invalid credentials");
                return null;
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "tiktok") {
                try {
                    await connectDB();

                    // Check if user exists
                    let dbUser = await User.findOne({ email: user.email });

                    if (!dbUser) {
                        // Create new user for TikTok OAuth
                        dbUser = await User.create({
                            email: user.email,
                            name: user.name || profile?.display_name || "TikTok User",
                            image: user.image || profile?.avatar_url,
                            provider: "tiktok",
                        });
                    }

                    return true;
                } catch (error) {
                    console.error("Error in signIn callback:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.image = token.image as string;
            }
            return session;
        },
    },
});
