/**
 * @fileoverview Event content rendering for Calendar component
 * Provides utility functions and component for formatting and displaying calendar events
 * 
 * @module CalendarEventContent
 * @category Components
 * @subcategory Calendar
 */

import { EventContentProps } from "./types"

/**
 * Formats a date to a localized time string
 * 
 * @function formatTime
 * @description Converts a Date object to a 24-hour time string
 * 
 * @param {Date | null} date - The date to format
 * @returns {string} Formatted time string or empty string if date is null
 * 
 * @example
 * formatTime(new Date()) // Returns "14:30"
 * formatTime(null) // Returns ""
 */
const formatTime = (date: Date | null): string => {
  if (!date) return ''
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

/**
 * Gets an initial representing the work order type
 * 
 * @function getTypeInitial
 * @description Converts a work order type to a short initial or first character
 * 
 * @param {string} type - The work order type
 * @returns {string} A short initial representing the type
 * 
 * @example
 * getTypeInitial("DELIVERY") // Returns "D"
 * getTypeInitial("SETUP") // Returns "SU"
 * getTypeInitial("UNKNOWN") // Returns "U"
 */
const getTypeInitial = (type: string): string => {
  const typeMap: Record<string, string> = {
    'DELIVERY': 'D',
    'ACTIVATION': 'A',
    'SETUP': 'SU',
    'TEARDOWN': 'TU'
  }
  return typeMap[type.toUpperCase()] || type.charAt(0)
}

/**
 * Renders the content of a calendar event
 * 
 * @component EventContent
 * @description Displays formatted event information including time, type, fame number, and client
 * 
 * @param {EventContentProps} props - The event content properties
 * @returns {JSX.Element} A formatted event content element
 * 
 * @example
 * <EventContent event={workOrderEvent} />
 */
export const EventContent = ({ event }: EventContentProps) => {
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
