import { authOptions } from "../../../../lib/authOptions";
import NextAuth from "next-auth/next";
import { SessionUser } from "@/types/user";

/**
 * Type augmentation for NextAuth.js
 */
declare module "next-auth" {
  interface User extends SessionUser {}

  /**
   * Extends the Session interface to include our custom User type
   */
  interface Session {
    user: SessionUser;
  }
}

/**
 * Type augmentation for NextAuth.js JWT
 */
declare module "next-auth/jwt" {
  interface JWT extends Omit<SessionUser, 'accessToken'> {}
}

export const dynamic = 'force-dynamic';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }