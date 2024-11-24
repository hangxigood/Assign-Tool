"use client"

import { useState } from "react"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Button } from "@/components/ui/button"

interface Event {
  id: string
  title: string
  start: string
  end: string
  backgroundColor?: string
  borderColor?: string
  type?: string
}

export function Calendar() {
  const [view, setView] = useState<"timeGridDay" | "timeGridWeek">("timeGridDay")
  
  // Mock events - replace with actual data
  const events: Event[] = [
    {
      id: "1",
      title: "Primary 5356 - Switch",
      start: "2024-01-22T09:00:00",
      end: "2024-01-22T10:00:00",
      backgroundColor: "#3b82f6",
      borderColor: "#2563eb",
      type: "primary"
    },
    {
      id: "2",
      title: "Emergency 5357 - HVAC",
      start: "2024-01-22T11:00:00",
      end: "2024-01-22T12:00:00",
      backgroundColor: "#ef4444",
      borderColor: "#dc2626",
      type: "emergency"
    }
  ]

  const handleEventDrop = (info: any) => {
    console.log("Event dropped:", {
      id: info.event.id,
      newStart: info.event.start,
      newEnd: info.event.end
    })
    // TODO: Implement backend update
  }

  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg shadow p-4 h-full">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={view === "timeGridDay" ? "default" : "outline"}
            onClick={() => setView("timeGridDay")}
          >
            Day
          </Button>
          <Button
            variant={view === "timeGridWeek" ? "default" : "outline"}
            onClick={() => setView("timeGridWeek")}
          >
            Week
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView={view}
          editable={true}
          droppable={true}
          eventDrop={handleEventDrop}
          slotMinTime="08:00:00"
          slotMaxTime="17:00:00"
          allDaySlot={false}
          events={events}
          headerToolbar={false}
          eventOverlap={true}
          slotEventOverlap={true}
          expandRows={true}
          height="100%"
          scrollTime="08:00:00"
        />
      </div>
    </div>
  )
}
