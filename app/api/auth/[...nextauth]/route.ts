import { authOptions } from "../../../../lib/authOptions";
import NextAuth from "next-auth/next";
import { DefaultJWT } from "next-auth/jwt";
import { DefaultUser } from "next-auth";

/**
 * Type augmentation for NextAuth.js
 */
declare module "next-auth" {
  interface User extends DefaultUser {
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
    accessToken?: string;
  }

  /**
   * Extends the Session interface to include our custom User type
   */
  interface Session {
    user: User;
  }
}

/**
 * Type augmentation for NextAuth.js JWT
 */
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    sub: string;
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
  }
}

export const dynamic = 'force-dynamic';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }