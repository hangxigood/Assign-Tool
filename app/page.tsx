'use client'

import { useState } from "react"
import { Calendar } from "@/components/calendar"
import { Sidebar } from "@/components/sidebar"
import { StatsBar } from "@/components/stats-bar"
import { EventDetailsSidebar } from "@/components/event-details-sidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 relative">
        <Button
          variant="ghost"
          className="lg:hidden absolute top-4 left-4 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <Sidebar 
          onEventSelect={setSelectedEvent} 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 p-4 overflow-x-auto overflow-y-hidden mt-14 lg:mt-0">
              <Calendar onEventSelect={setSelectedEvent} selectedEvent={selectedEvent} />
            </div>
            <StatsBar />
          </main>
        </div>
      </div>
      <EventDetailsSidebar
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  )
}
