import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authConfig = {
  session: { strategy: "jwt" },
  trustHost: true,
  useSecureCookies: false,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // Validation logic is implemented in auth.ts (where Prisma is available).
        // For Edge middleware compatibility, we just need the credentials structure here.
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.tenantSlug = (user as any).tenantSlug;
        token.email = user.email;
        token.name = user.name;
      }
      
      // Update tenantSlug if we implement workspace switching in the future
      if (trigger === "update" && session?.tenantSlug) {
        token.tenantSlug = session.tenantSlug;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        (session.user as any).tenantSlug = token.tenantSlug as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
