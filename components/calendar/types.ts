/**
 * @fileoverview Type definitions for the Calendar component
 * Provides type safety and consistent interfaces for calendar-related components
 * 
 * @module CalendarTypes
 * @category Components
 * @subcategory Calendar
 */

import { WorkOrderEvent } from "@/types/workorder"

/**
 * Properties for the Calendar component
 * 
 * @interface CalendarProps
 * @description Defines the required properties for rendering the Calendar
 * 
 * @property {function} onEventSelect - Callback function triggered when an event is selected
 * @property {WorkOrderEvent[]} events - Array of work order events to display in the calendar
 */
export interface CalendarProps {
  onEventSelect: (event: WorkOrderEvent | null) => void
  events: WorkOrderEvent[]
}

/**
 * Properties for rendering individual calendar event content
 * 
 * @interface EventContentProps
 * @description Defines the structure of an event for rendering in the calendar
 * 
 * @property {Object} event - The event object to be rendered
 * @property {Date | null} event.start - Start date of the event
 * @property {Date | null} event.end - End date of the event
 * @property {Object} event.extendedProps - Additional properties of the event
 * @property {string} event.extendedProps.type - Type of the work order
 * @property {string} event.extendedProps.fameNumber - Fame number of the work order
 * @property {string} event.extendedProps.clientName - Name of the client
 * @property {string} event.extendedProps.assignedTo - Name of the assigned technician
 */
export interface EventContentProps {
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
