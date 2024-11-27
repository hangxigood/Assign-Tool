/**
 * @fileoverview Core types and utilities for work order management in the Docket application.
 * This module provides the base interfaces and helper functions for handling work orders
 * across different components of the application.
 */

import { WorkOrderType, WorkOrderStatus } from '@prisma/client'

/**
 * Base interface representing a work order in the system.
 * Contains all essential information about a work order including client details,
 * scheduling information, and assigned personnel.
 */
export interface WorkOrder {
  /** Unique identifier for the work order */
  id: string
  /** Title/name of the work order */
  title: string
  /** Reference number in the FAME system */
  fameNumber: string
  /** Type of work order (e.g., PICKUP, DELIVERY, SETUP) */
  type: WorkOrderType
  /** Current status of the work order */
  status: WorkOrderStatus
  /** Scheduled start date and time */
  startDate: string | Date
  /** Scheduled end date and time (optional) */
  endDate: string | Date | null
  /** Name of the client */
  clientName: string
  /** Client's email address (optional) */
  clientEmail?: string
  /** Client's phone number (optional) */
  clientPhone?: string
  /** ID of the pickup location (optional) */
  pickupLocationId?: string
  /** ID of the delivery location (optional) */
  deliveryLocationId?: string
  /** Information about the assigned technician */
  assignedTo: {
    /** Unique identifier of the assigned technician */
    id: string
    /** First name of the assigned technician */
    firstName: string
    /** Last name of the assigned technician */
    lastName: string
  }
  /** Information about the supervising staff member (optional) */
  supervisor?: {
    /** Unique identifier of the supervisor */
    id: string
    /** First name of the supervisor */
    firstName: string
    /** Last name of the supervisor */
    lastName: string
  }
}

/**
 * Interface for work order form data.
 * Used specifically for creating and editing work orders through forms.
 * Simplifies the structure by using IDs instead of nested objects for relationships.
 */
export interface WorkOrderFormData {
  /** Unique identifier for the work order */
  id: string
  /** Title/name of the work order */
  title: string
  /** Reference number in the FAME system */
  fameNumber: string
  /** Type of work order */
  type: WorkOrderType
  /** Current status of the work order */
  status: WorkOrderStatus
  /** Scheduled start date and time (in string format for form inputs) */
  startDate: string
  /** Scheduled end date and time (in string format for form inputs) */
  endDate: string | null
  /** Name of the client */
  clientName: string
  /** Client's email address (optional) */
  clientEmail?: string
  /** Client's phone number (optional) */
  clientPhone?: string
  /** ID of the pickup location (optional) */
  pickupLocationId?: string
  /** ID of the delivery location (optional) */
  deliveryLocationId?: string
  /** ID of the assigned technician (optional) */
  assignedToId?: string
  /** ID of the supervisor (optional) */
  supervisorId?: string
}

/**
 * Interface for calendar-specific work order events.
 * Extends the base work order data with properties needed for calendar display.
 */
export interface WorkOrderEvent {
  /** Unique identifier for the work order */
  id: string
  /** Display title for the calendar event */
  title: string
  /** Event start time as Date object */
  start: Date
  /** Event end time as Date object */
  end: Date
  /** Optional background color for calendar display */
  backgroundColor?: string
  /** Optional border color for calendar display */
  borderColor?: string
  /** Type of work order */
  type: WorkOrderType
  /** Current status of the work order */
  status: WorkOrderStatus
  /** Name of the client */
  clientName: string
  /** Additional properties for extended functionality */
  extendedProps: {
    /** Type of work order */
    type: WorkOrderType
    /** Current status of the work order */
    status: WorkOrderStatus
    /** Name of the client */
    clientName: string
    /** Formatted name of assigned technician */
    assignedTo: string
    /** Formatted name of supervisor */
    supervisor: string
  }
}

/**
 * Safely converts a date string or Date object to a Date object.
 * @param date - The date to convert
 * @returns A Date object representing the input date
 */
export function toDate(date: string | Date | null): Date {
  if (!date) {
    return new Date()
  }
  return typeof date === 'string' ? new Date(date) : date
}

/**
 * Formats a date for use in datetime-local input fields.
 * @param date - The date to format
 * @returns A string in the format "YYYY-MM-DDThh:mm"
 */
export function formatDateForInput(date: string | Date | null): string {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toISOString().slice(0, 16) // Format: "YYYY-MM-DDThh:mm"
}

/**
 * Converts a WorkOrder object to a WorkOrderEvent object for calendar display.
 * @param workOrder - The work order to convert
 * @returns A WorkOrderEvent object suitable for calendar display
 */
export function toWorkOrderEvent(workOrder: WorkOrder): WorkOrderEvent {
  return {
    id: workOrder.id,
    title: workOrder.title,
    start: toDate(workOrder.startDate),
    end: toDate(workOrder.endDate),
    type: workOrder.type,
    status: workOrder.status,
    clientName: workOrder.clientName,
    extendedProps: {
      type: workOrder.type,
      status: workOrder.status,
      clientName: workOrder.clientName,
      assignedTo: formatAssigneeName(workOrder.assignedTo),
      supervisor: workOrder.supervisor ? formatAssigneeName(workOrder.supervisor) : ''
    }
  }
}

/**
 * Converts a WorkOrder object to WorkOrderFormData for form editing.
 * @param workOrder - The work order to convert
 * @returns A WorkOrderFormData object suitable for form editing
 */
export function toWorkOrderFormData(workOrder: WorkOrder): WorkOrderFormData {
  return {
    id: workOrder.id,
    title: workOrder.title,
    fameNumber: workOrder.fameNumber,
    type: workOrder.type,
    status: workOrder.status,
    startDate: formatDateForInput(workOrder.startDate),
    endDate: formatDateForInput(workOrder.endDate),
    clientName: workOrder.clientName,
    clientEmail: workOrder.clientEmail,
    clientPhone: workOrder.clientPhone,
    pickupLocationId: workOrder.pickupLocationId,
    deliveryLocationId: workOrder.deliveryLocationId,
    assignedToId: workOrder.assignedTo.id,
    supervisorId: workOrder.supervisor?.id
  }
}

/**
 * Formats a person's name from their first and last name.
 * @param assignedTo - Object containing firstName and lastName
 * @returns Formatted full name as a string
 */
export function formatAssigneeName(assignedTo: { firstName: string, lastName: string }): string {
  return `${assignedTo.firstName} ${assignedTo.lastName}`
}

/**
 * Formats a date for display in the UI.
 * @param date - The date to format
 * @returns A formatted date string in the local format
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}
