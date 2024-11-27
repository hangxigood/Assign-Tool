'use client'

import { useState } from "react"
import { Calendar } from "@/components/Calendar"
import { Sidebar } from "@/components/Sidebar"
import { StatsBar } from "@/components/StatsBar"
import { EventDetailsSidebar } from "@/components/EventDetailsSidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WorkOrderEvent } from "@/types/workorder"

export default function Page() {
  const [selectedEvent, setSelectedEvent] = useState<WorkOrderEvent | null>(null)
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
              <Calendar onEventSelect={setSelectedEvent} />
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
