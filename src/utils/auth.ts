import NextAuth, { NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { hashString } from "@/utils/encrypt";
import { prisma } from "./prisma";


export const authOptions: NextAuthConfig = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                console.log('kesini')
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });
                console.log('test kesini')

                const encryptedPassword = hashString(credentials.password as string)
                console.log('user: ', user)

                if (user && encryptedPassword === user.password) {
                    return user;
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    // use our own (route) pages for next-auth, don't use built-in pages from next-auth.
    // see https://next-auth.js.org/configuration/pages
    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/error',
    },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
