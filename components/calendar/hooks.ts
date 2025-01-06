/**
 * @fileoverview Custom hooks for Calendar component
 * Provides reusable logic for calendar state management and event handling
 * 
 * @module CalendarHooks
 * @category Components
 * @subcategory Calendar
 */

import { useState, useCallback } from "react"
import { CalendarApi, EventDropArg } from '@fullcalendar/core'

/**
 * Custom hook for managing FullCalendar API and responsive interactions
 * 
 * Data Flow:
 * 1. Component creates a ref to FullCalendar component
 * 2. When ref is available, calls setCalendarApi with the calendar's API
 * 3. Stored API enables programmatic calendar manipulations
 * 
 * Key Responsibilities:
 * - Provide a way to store and access the FullCalendar API instance
 * - Enable responsive view changes based on screen width
 * 
 * @returns {Object} An object containing:
 * - `setCalendarApi`: Function to store the FullCalendar API instance
 * - `handleResize`: Callback to dynamically change calendar view based on screen width
 * 
 * @example
 * // In a component using FullCalendar
 * const { setCalendarApi, handleResize } = useCalendarApi()
 * 
 * // Attach to FullCalendar component
 * <FullCalendar
 *   ref={(el) => {
 *     if (el) setCalendarApi(el.getApi())
 *   }}
 *   windowResize={handleResize}
 * />
 */
export const useCalendarApi = (): {
  setCalendarApi: (api: CalendarApi | null) => void,
  handleResize: () => void
} => {
  const [calendarApi, setCalendarApi] = useState<CalendarApi | null>(null)

  const handleResize = useCallback(() => {
    if (!calendarApi) return
    const view = window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek'
    calendarApi.changeView(view)
  }, [calendarApi])

  return { setCalendarApi, handleResize }
}

/**
 * Custom hook to handle work order event drop (rescheduling)
 * 
 * @function useEventDrop
 * @description Provides a callback to update work order dates when dragged in the calendar
 * 
 * @returns {function} A memoized callback that updates a work order's start and end dates via API
 * 
 * @throws {Error} If the work order update fails
 * 
 * @example
 * const handleEventDrop = useEventDrop()
 * // Use in FullCalendar's eventDrop prop
 */
export const useEventDrop = (): ((info: EventDropArg) => Promise<void>) => {
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
