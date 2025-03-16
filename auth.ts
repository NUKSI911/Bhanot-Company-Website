// app/api/auth/[...nextauth]/route.ts
import { prisma } from "@/db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt";
import { cookies } from "next/headers";
import {  NextResponse } from "next/server";

export const authConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        if (user?.password && compareSync(credentials.password as string, user.password)) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }:any) {
      session.user = {
        ...session.user,
        id: token.sub,
        role: token.role,
        name: token.name,
      };
      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ user, token, trigger, session }:any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;

        if (user.name === "NO_NAME") {
          token.name = user.email?.split("@")[0] || "";
          await fetch(`${process.env.NEXTAUTH_URL}/api/update-name`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: cookies().toString(),
            },
            body: JSON.stringify({ userId: user.id, name: token.name }),
          });
        }

        if (trigger === "update") {
          token.name = session?.user?.name;
        }

        if (trigger === "signIn" || trigger === "signUp") {
          const sessionCartId = (await cookies()).get("sessionCartId")?.value;
          if (sessionCartId) {
            await fetch(`${process.env.NEXTAUTH_URL}/api/merge-cart`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: cookies().toString(),
              },
              body: JSON.stringify({ 
                userId: user.id,
                sessionCartId 
              }),
            });
          }
        }
      }
      return token;
    },

    authorized({ auth, request }) {
      const protectedPaths = [
        /\/shipping-address/,
        /\/admin/,
        /\/user\//,
        /\/order\//,
        /\/place-order/,
        /\/profile/,
        /\/payment-method/,
      ];

      const { pathname } = request.nextUrl;
      if (!auth && protectedPaths.some(p => p.test(pathname))) return false;

      if (!request.cookies.get("sessionCartId")) {
        const response = NextResponse.next();
        response.cookies.set("sessionCartId", crypto.randomUUID());
        return response;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);