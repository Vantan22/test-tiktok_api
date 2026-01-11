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
                return null; // Invalid credentials
            },
        }),
    ],
});
