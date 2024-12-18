"use client"

import { useState, useCallback, useMemo } from "react"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { WorkOrderEvent } from "@/types/workorder"
import { CalendarApi, EventDropArg, EventClickArg } from '@fullcalendar/core'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

// Types
interface CalendarProps {
  onEventSelect: (event: WorkOrderEvent | null) => void
  events: WorkOrderEvent[]
}

interface EventContentProps {
  event: {
    start: Date | null
    end: Date | null
    extendedProps: {
      type: string
      fameNumber: string
      clientName: string
      assignedTo: string
    }
  }
}

// Utility functions
const formatTime = (date: Date | null): string => {
  if (!date) return ''
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  })
}

const getTypeInitial = (type: string): string => {
  const typeMap: Record<string, string> = {
    'DELIVERY': 'D',
    'ACTIVATION': 'A',
    'SETUP': 'SU',
    'TEARDOWN': 'TU'
  }
  return typeMap[type.toUpperCase()] || type.charAt(0)
}

// Components
const EventContent = ({ event }: EventContentProps) => {
  const startTime = formatTime(event.start)
  const endTime = formatTime(event.end)
  
  return (
    <div className="p-1 text-xs">
      <div className="font-medium">{startTime}-{endTime}</div>
      <div>
        {getTypeInitial(event.extendedProps.type)}-
        {event.extendedProps.fameNumber}-
        {event.extendedProps.clientName}
      </div>
      <div>{event.extendedProps.assignedTo}</div>
    </div>
  )
}

// Custom hooks
const useCalendarApi = () => {
  const [calendarApi, setCalendarApi] = useState<CalendarApi | null>(null)
  
  const handleResize = useCallback(() => {
    if (!calendarApi) return
    const view = window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek'
    calendarApi.changeView(view)
  }, [calendarApi])
  
  return { setCalendarApi, handleResize }
}

const useEventDrop = () => {
  return useCallback(async (info: EventDropArg) => {
    const { event } = info
    try {
      const response = await fetch(`/api/workorders/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: event.start,
          endDate: event.end,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update work order')
      }
    } catch (error) {
      console.error('Error updating work order:', error)
      info.revert()
    }
  }, [])
}

// Main Calendar component
export function Calendar({ onEventSelect, events }: CalendarProps) {
  const { setCalendarApi, handleResize } = useCalendarApi()
  const handleEventDrop = useEventDrop()
  
  const calendarOptions = useMemo(() => ({
    height: "100%",
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: "timeGridWeek",
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridDay,timeGridWeek'
    },
    views: {
      timeGridWeek: {
        titleFormat: { month: 'short', day: 'numeric' } as const,
        dayHeaderFormat: { weekday: 'short', day: 'numeric' } as const,
        slotDuration: '01:00:00',
      },
      timeGridDay: {
        titleFormat: { month: 'short', day: 'numeric' } as const,
        slotDuration: '01:00:00',
      }
    },
    allDaySlot: false,
    slotMinTime: "00:00:00",
    slotMaxTime: "24:00:00"
  }), [])

  const handleEventClick = useCallback((info: EventClickArg) => {
    const originalEvent = events.find(e => e.id === info.event.id)
    if (originalEvent) {
      onEventSelect(originalEvent)
    }
  }, [events, onEventSelect])

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-end gap-2 mb-4">
        <Link href="/workorders">
          <Button variant="outline" size="sm">View List</Button>
        </Link>
      </div>
      <div className="flex-1">
        <FullCalendar
          {...calendarOptions}
          events={events}
          eventDrop={handleEventDrop}
          eventClick={handleEventClick}
          windowResize={handleResize}
          ref={(el) => {
            if (el) setCalendarApi(el.getApi())
          }}
          eventContent={EventContent}
        />
      </div>
    </div>
  )
}
