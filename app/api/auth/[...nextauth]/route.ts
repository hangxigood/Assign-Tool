import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Type augmentation to include role
declare module "next-auth" {
  interface User {
    id: string;
    role: UserRole;
    firstName: string;
    lastName: string;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    firstName: string;
    lastName: string;
  }
}

import { UserRole } from "@prisma/client";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
