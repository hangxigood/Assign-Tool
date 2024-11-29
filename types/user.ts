// types/user.ts
import { User as PrismaUser, UserRole } from '@prisma/client'

// Base user properties
interface UserBase {
    id: string
    email: string
    firstName: string
    lastName: string
    role: UserRole
    phone?: string
}

// For authentication contexts
export interface AuthUser extends UserBase {
    password: string
}

// For display contexts (no sensitive data)
export interface DisplayUser extends UserBase {
    fullName: string  // Computed property
}

// For form handling
export interface UserFormData extends Omit<UserBase, 'id'> {
    password?: string  // Optional for updates
}

// Type guard
export function isDisplayUser(user: any): user is DisplayUser {
    return (
        typeof user === 'object' &&
        user !== null &&
        typeof user.id === 'string' &&
        typeof user.email === 'string' &&
        typeof user.firstName === 'string' &&
        typeof user.lastName === 'string' &&
        typeof user.role === 'string'
    )
}

// Type mapping from Prisma
export type User = Omit<PrismaUser, 'password' | 'createdAt' | 'updatedAt'>

// NextAuth session user type
export interface SessionUser extends Omit<UserBase, 'password'> {
    accessToken?: string
}