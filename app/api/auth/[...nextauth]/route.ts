import { authOptions } from "../../../../lib/authOptions";
import NextAuth from "next-auth/next";
import { UserRole } from "@prisma/client";

/**
 * Type augmentation for NextAuth.js
 * Extends the default types to include custom user properties for the Docket application.
 */
declare module "next-auth" {
  /**
   * Extends the default User interface with additional properties
   * @interface User
   * @property {string} id - Unique identifier for the user
   * @property {UserRole} role - User's role in the system (ADMIN, COORDINATOR, SUPERVISOR, TECHNICIAN)
   * @property {string} firstName - User's first name
   * @property {string} lastName - User's last name
   */
  interface User {
    id: string;
    role: UserRole;
    firstName: string;
    lastName: string;
  }

  /**
   * Extends the Session interface to include our custom User type
   * @interface Session
   * @property {User} user - The user object containing extended properties
   */
  interface Session {
    user: User;
  }
}

/**
 * Type augmentation for NextAuth.js JWT
 * Ensures the JWT token includes the same custom properties as the User
 */
declare module "next-auth/jwt" {
  /**
   * Extends the JWT interface to match our User interface
   * @interface JWT
   * @property {string} id - Unique identifier for the user
   * @property {UserRole} role - User's role in the system
   * @property {string} firstName - User's first name
   * @property {string} lastName - User's last name
   */
  interface JWT {
    id: string;
    role: UserRole;
    firstName: string;
    lastName: string;
  }
}

export const dynamic = 'force-dynamic';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };