import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Metadata } from "next"
import { getServerSession } from 'next-auth';
import SessionProvider from '@/components/SessionProvider';
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Work Order Management System",
  description: "A system for managing work orders and resources",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning className={inter.className}>
        <SessionProvider session={session}>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
