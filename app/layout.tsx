/**
 * Root layout component for the Docket application.
 * This component serves as the main layout wrapper for all pages,
 * providing session management, styling, and common UI elements.
 * 
 * @module Layout
 */

import "@/public/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { getServerSession } from 'next-auth';
import { SessionProvider } from "@/components/SessionProvider";
import { Toaster } from "@/components/ui/toaster"
import BackgroundPattern from "@/components/BackgroundPattern";

// Initialize Inter font with Latin subset
const inter = Inter({ subsets: ["latin"] })

/**
 * Metadata configuration for the application
 */
export const metadata: Metadata = {
  title: "Scheduling Dashboard",
  description: "Workforce management and scheduling dashboard",
}

/**
 * Root layout component that wraps all pages in the application.
 * Provides session management, styling, and common UI elements.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout
 * @returns {Promise<JSX.Element>} The rendered layout component
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<JSX.Element> {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning className={inter.className}>
        <SessionProvider session={session}>
          <BackgroundPattern>{children}</BackgroundPattern>
          <Toaster /> {/* Add toast notifications */}
        </SessionProvider>
      </body>
    </html>
  )
}
