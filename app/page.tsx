'use client'

import { useState } from "react"
import { Calendar } from "@/components/calendar"
import { Sidebar } from "@/components/sidebar"
import { StatsBar } from "@/components/stats-bar"
import { EventDetailsSidebar } from "@/components/event-details-sidebar"

export default function Page() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  return (
    <>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar onEventSelect={setSelectedEvent} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 p-4 overflow-hidden">
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
