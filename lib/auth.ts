import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email) return null;

                try {
                    const email = credentials.email.toLowerCase().trim();
                    console.log("[Auth] Attempting login for:", email);

                    // Diagnostic: Check if we can even connect
                    const userCount = await prisma.user.count();
                    console.log("[Auth] Total users in DB:", userCount);

                    const user = await prisma.user.findUnique({
                        where: { email: email },
                    });

                    if (user) {
                        console.log("[Auth] User found successfully:", user.email);
                        return { id: user.id, name: user.name, email: user.email, role: user.role } as any;
                    }

                    console.warn("[Auth] No user found with email:", email);
                    return null;
                } catch (error: any) {
                    console.error("[Auth] Database error during login:", error.message || error);
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
};
