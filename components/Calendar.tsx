"use client"

/**
 * @fileoverview Main calendar component for displaying and managing work orders
 * @module Calendar
 */

import { useState } from "react"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { WorkOrderEvent } from "@/types/workorder"
import { CalendarApi, EventDropArg } from '@fullcalendar/core'

/**
 * Calendar component for displaying work orders in a time grid view
 * @component
 * @param {Object} props - Component props
 * @param {function} props.onEventSelect - Callback function when an event is selected
 * @param {WorkOrderEvent[]} props.events - Array of work order events to display
 */
export function Calendar({
  onEventSelect,
  events
}: {
  onEventSelect: (event: WorkOrderEvent | null) => void
  events: WorkOrderEvent[]
}) {
  const [calendarApi, setCalendarApi] = useState<CalendarApi | null>(null)

  const handleEventDrop = async (info: EventDropArg) => {
    const { event } = info
    try {
      const response = await fetch(`/api/workorders/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: event.start,
          endDate: event.end,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update work order')
        info.revert()
      }
    } catch (error) {
      console.error('Error updating work order:', error)
      info.revert()
    }
  }

  return (
    <div className="h-full">
      <FullCalendar
        height="100%"
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'timeGridDay,timeGridWeek'
        }}
        views={{
          timeGridWeek: {
            titleFormat: { month: 'short', day: 'numeric' },
            dayHeaderFormat: { weekday: 'short', day: 'numeric' },
            slotDuration: '01:00:00',
          },
          timeGridDay: {
            titleFormat: { month: 'short', day: 'numeric' },
            slotDuration: '01:00:00',
          }
        }}
        windowResize={() => {
          if (!calendarApi) return;
          if (window.innerWidth < 768) {
            calendarApi.changeView('timeGridDay');
          } else {
            calendarApi.changeView('timeGridWeek');
          }
        }}
        allDaySlot={false}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        events={events}
        editable={true}
        eventDrop={handleEventDrop}
        eventClick={(info) => {
          // Find the original WorkOrderEvent from our events array
          const originalEvent = events.find(e => e.id === info.event.id)
          if (originalEvent) {
            onEventSelect(originalEvent)
          }
        }}
        ref={(el) => {
          if (el) {
            setCalendarApi(el.getApi())
          }
        }}
        eventContent={(arg) => {
          const event = arg.event
          return (
            <div className="p-1">
              <div className="font-medium">{event.title}</div>
              <div>Assigned: {event.extendedProps.assignedTo}</div>
              <div>Supervisor: {event.extendedProps.supervisor}</div>
            </div>
          )
        }}
      />
    </div>
  )
}
