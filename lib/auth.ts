import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcrypt";
import { Session } from "next-auth";
import { UserRole } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,         // Added for authorization
          firstName: user.firstName, // Added for authorization
          lastName: user.lastName // Added for authorization
        };
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;         // Add role to token
        token.firstName = user.firstName; // Add firstName to token
        token.lastName = user.lastName;   // Add lastName to token
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;         // Add role to session
        session.user.firstName = token.firstName as string; // Add firstName to session
        session.user.lastName = token.lastName as string;   // Add lastName to session
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
