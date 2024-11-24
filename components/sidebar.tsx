"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, LogOut } from 'lucide-react'
import { useSession, signOut } from "next-auth/react"

export function Sidebar() {
  const { data: session } = useSession()

  return (
    <div className="w-64 border-r bg-gray-800 text-white">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Hello, {session?.user?.firstName || 'User'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-400">ACTIVITY FEED</h3>
          <ScrollArea className="h-[400px] mt-2">
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">8:30 - 9:00 AM</span>
                </div>
                <p className="mt-1 text-sm">Monthly catch-up</p>
              </div>
              {/* Add more activity items */}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
