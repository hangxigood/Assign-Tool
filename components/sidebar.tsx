"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-gray-800 text-white">
      <div className="p-4">
        <h2 className="text-xl font-semibold">Hello, User</h2>
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

