import "@/public/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { getServerSession } from 'next-auth';
import { SessionProvider } from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Scheduling Dashboard",
  description: "Workforce management and scheduling dashboard",
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
        </SessionProvider>
      </body>
    </html>
  )
}
