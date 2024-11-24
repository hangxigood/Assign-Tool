"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8) // 8 AM to 5 PM

export function Calendar() {
  const [view, setView] = useState<"day" | "week">("day")
  
  return (
    <div className="bg-white rounded-lg shadow">
      <ScrollArea className="h-[calc(100vh-13rem)]">
        <div className="min-w-full">
          <div className="grid grid-cols-[64px_1fr] divide-x">
            <div className="sticky left-0 bg-white">
              {HOURS.map((hour) => (
                <div key={hour} className="h-20 border-b text-sm text-gray-500 text-right pr-2">
                  {`${hour}:00`}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 divide-x">
              {view === "day" ? (
                <DayView />
              ) : (
                <WeekView />
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

function DayView() {
  // Mock data - replace with actual data from API
  const events = [
    {
      id: 1,
      title: "Primary 5356 - Switch",
      start: 8,
      duration: 1,
      color: "blue",
    },
    // Add more events
  ]

  return (
    <div className="relative">
      {events.map((event) => (
        <div
          key={event.id}
          className={`absolute left-0 right-0 mx-2 rounded p-2 text-sm`}
          style={{
            top: `${(event.start - 8) * 5}rem`,
            height: `${event.duration * 5}rem`,
            backgroundColor: event.color,
          }}
        >
          {event.title}
        </div>
      ))}
    </div>
  )
}

function WeekView() {
  // Similar to DayView but with 7 columns
  return <div>Week view implementation</div>
}

