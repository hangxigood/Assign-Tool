import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter an email and password');
          }
  
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });
  
          if (!user) {
            throw new Error('No user found');
          }
  
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
  
          if (!isPasswordCorrect) {
            throw new Error('Incorrect password');
          }
  
          return {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
          };
        }
      })
    ],
    session: {
      strategy: "jwt"
    },
    callbacks: {
      jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.role = user.role;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
        }
        return token;
      },
      session({ session, token }) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        return session;
      }
    }
  };