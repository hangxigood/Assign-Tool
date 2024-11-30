/**
 * @fileoverview User type definitions for the Docket application.
 * 
 * This file defines the type hierarchy for user-related data throughout the application:
 * 
 * Type Hierarchy:
 * PrismaUser (Database Schema)
 *        ↓
 * User (Application Model) 
 *        ↓
 * UserBase (Auth + Custom Fields)
 *        ↓
 * DisplayUser, AuthUser, UserFormData (Specialized Types)
 * 
 * The hierarchy is designed to:
 * 1. Integrate seamlessly with Prisma's database schema
 * 2. Support Next-auth authentication
 * 3. Provide specialized types for different contexts (UI, forms, auth)
 */

import { User as PrismaUser, UserRole } from '@prisma/client'
import { DefaultUser } from 'next-auth'

/**
 * Application's base user type
 * Extends Next-auth's DefaultUser to ensure compatibility with auth system
 * while adding our custom fields
 */
interface UserBase extends DefaultUser {
    firstName: string
    lastName: string
    role: UserRole
    phone?: string
}

/**
 * Main User type for the application
 * Maps from Prisma schema, excluding sensitive and metadata fields
 * This is the primary type used throughout the application
 */
export type User = Omit<PrismaUser, 'password' | 'createdAt' | 'updatedAt'>

/**
 * User type for database operations
 * Alias for User type to make database operations more explicit
 */
export type DatabaseUser = User

/**
 * User type for authentication contexts
 * Includes password for login/registration
 */
export interface AuthUser extends UserBase {
    password: string
}

/**
 * User type for display/UI contexts
 * Includes computed properties, excludes sensitive data
 */
export interface DisplayUser extends UserBase {
    fullName: string
}

/**
 * User type for form handling
 * Makes auth-related fields optional for updates
 */
export interface UserFormData extends Omit<UserBase, 'id' | 'email' | 'image' | 'name'> {
    email?: string
    password?: string
}

/**
 * Type guard to validate DisplayUser objects
 */
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