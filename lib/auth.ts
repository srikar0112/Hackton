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

                const email = credentials.email.toLowerCase().trim();

                try {
                    const user = await prisma.user.findUnique({
                        where: { email },
                    });

                    // If user found in DB, return them
                    if (user) {
                        return { id: user.id, name: user.name, email: user.email, role: user.role } as any;
                    }
                } catch (error: any) {
                    console.error("[Auth] DB error:", error.message);
                }

                // Fallback: Accept ANY email/password — create a demo session
                const name = email.split("@")[0];
                return {
                    id: email,
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    email: email,
                    role: "STUDENT",
                } as any;
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
