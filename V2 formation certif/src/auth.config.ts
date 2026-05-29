import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import AzureAD from 'next-auth/providers/azure-ad';
import bcrypt from 'bcryptjs';

// Configuration exportable edge-compatible
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');

      if (isDashboard || isAdminRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // Prevent logged-in users from accessing login page again
        if (nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register')) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as 'USER' | 'INSTRUCTOR' | 'ADMIN';
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
    Credentials({
      async authorize(credentials) {
        // Validation basique (la vraie validation a lieu dans auth.ts avec Prisma)
        if (!credentials?.email || !credentials?.password) return null;
        return null; // Remplacé dynamiquement dans auth.ts
      },
    }),
  ],
} satisfies NextAuthConfig;
