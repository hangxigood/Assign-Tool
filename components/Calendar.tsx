"use client"

/**
 * @fileoverview Main calendar component for displaying and managing work orders
 * @module Calendar
 */

import { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { WorkOrderEvent, WorkOrder, toWorkOrderEvent, isValidWorkOrder } from "@/types/workorder"
import { CalendarApi, EventClickArg, EventDropArg } from '@fullcalendar/core'

/**
 * Calendar component for displaying work orders in a time grid view
 * @component
 * @param {Object} props - Component props
 * @param {function} props.onEventSelect - Callback function when an event is selected
 */
export function Calendar({
  onEventSelect
}: {
  onEventSelect: (event: WorkOrderEvent | null) => void
}) {
  const [events, setEvents] = useState<WorkOrderEvent[]>([])
  const [calendarApi, setCalendarApi] = useState<CalendarApi | null>(null)

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await fetch('/api/workorders');
        if (!response.ok) throw new Error('Failed to fetch work orders');
        const workOrders = await response.json();
        
        // Light validation in production, full validation in development
        if (process.env.NODE_ENV === 'development') {
          const validWorkOrders = workOrders.filter((order: WorkOrder) => isValidWorkOrder(order));
          if (validWorkOrders.length !== workOrders.length) {
            console.warn('Some work orders failed validation');
          }
          setEvents(validWorkOrders.map(toWorkOrderEvent));
        } else {
          // In production, trust the API types but catch any runtime errors
          try {
            setEvents(workOrders.map(toWorkOrderEvent));
          } catch (error) {
            console.error('Error converting work orders to events:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching work orders:', error);
      }
    };

    fetchWorkOrders();
  }, [])

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
        eventClick={(info: EventClickArg) => {
          onEventSelect(info.event as unknown as WorkOrderEvent)
        }}
      />
    </div>
  )
}
