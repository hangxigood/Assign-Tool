/**
 * @fileoverview Core types and utilities for work order management in the Docket application.
 */

import { WorkOrderType, WorkOrderStatus } from '@prisma/client'

/**
 * Date format used for work order dates in forms
 */
export const WORK_ORDER_DATE_FORMAT = "YYYY-MM-DDThh:mm"

/**
 * Base interface containing common properties shared across work order types
 */
interface WorkOrderBase {
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
    /** Name of the client */
    clientName: string
    /** Client's email address */
    clientEmail?: string
    /** Client's phone number */
    clientPhone?: string
    /** ID of the pickup location */
    pickupLocationId?: string
    /** ID of the delivery location */
    deliveryLocationId?: string
}

/**
 * Represents a person (employee) in the system
 */
interface Person {
    /** Unique identifier */
    id: string
    /** First name */
    firstName: string
    /** Last name */
    lastName: string
}

/**
 * Main work order interface used throughout the application
 */
export interface WorkOrder extends WorkOrderBase {
    /** Scheduled start date and time */
    startDate: string | Date
    /** Scheduled end date and time */
    endDate: string | Date | null
    /** Information about the assigned technician */
    assignedTo: Person
    /** Information about the supervising staff member */
    supervisor?: Person
}

/**
 * Work order data structure optimized for form handling
 */
export interface WorkOrderFormData extends WorkOrderBase {
    /** Start date in ISO string format */
    startDate: string
    /** End date in ISO string format */
    endDate: string | null
    /** ID of the assigned technician */
    assignedToId: string
    /** ID of the supervisor */
    supervisorId?: string
}

/**
 * Work order structure optimized for calendar display
 */
export interface WorkOrderEvent extends WorkOrderBase {
    /** Event start time as Date object */
    start: Date
    /** Event end time as Date object */
    end: Date
    /** Optional background color for calendar display */
    backgroundColor?: string
    /** Optional border color for calendar display */
    borderColor?: string
    /** Additional properties for calendar functionality */
    extendedProps: {
        /** Type of work order */
        type: WorkOrderType
        /** Current status of the work order */
        status: WorkOrderStatus
        /** Name of the client */
        clientName: string
        /** Client's email address */
        clientEmail?: string
        /** Client's phone number */
        clientPhone?: string
        /** Formatted name of assigned technician */
        assignedTo: string
        /** Formatted name of supervisor */
        supervisor: string
    }
}

/**
 * Type guard to validate WorkOrder objects
 */
export function isValidWorkOrder(obj: any): obj is WorkOrder {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'string' &&
        typeof obj.title === 'string' &&
        typeof obj.fameNumber === 'string' &&
        typeof obj.type === 'string' &&
        typeof obj.status === 'string' &&
        typeof obj.clientName === 'string' &&
        obj.assignedTo && typeof obj.assignedTo.id === 'string'
    )
}

/**
 * Safely converts a date string or Date object to a Date object
 */
export function toDate(date: string | Date | null): Date {
    if (!date) {
        return new Date()
    }
    return typeof date === 'string' ? new Date(date) : date
}

/**
 * Formats a date for use in datetime-local input fields
 */
export function formatDateForInput(date: string | Date | null): string {
    if (!date) return ''
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toISOString().slice(0, 16)
}

/**
 * Converts a WorkOrder to a calendar-friendly WorkOrderEvent
 */
export function toWorkOrderEvent(workOrder: WorkOrder): WorkOrderEvent {
    const colors = getEventColor(workOrder.type);
    return {
        id: workOrder.id,
        title: `${workOrder.fameNumber} - ${workOrder.clientName}`,
        start: toDate(workOrder.startDate),
        end: toDate(workOrder.endDate),
        type: workOrder.type,
        status: workOrder.status,
        clientName: workOrder.clientName,
        fameNumber: workOrder.fameNumber,
        clientEmail: workOrder.clientEmail,
        clientPhone: workOrder.clientPhone,
        pickupLocationId: workOrder.pickupLocationId,
        deliveryLocationId: workOrder.deliveryLocationId,
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        extendedProps: {
            type: workOrder.type,
            status: workOrder.status,
            clientName: workOrder.clientName,
            clientEmail: workOrder.clientEmail,
            clientPhone: workOrder.clientPhone,
            assignedTo: formatAssigneeName(workOrder.assignedTo),
            supervisor: workOrder.supervisor ? formatAssigneeName(workOrder.supervisor) : ''
        }
    }
}

function getEventColor(type: WorkOrderType) {
    switch (type) {
        case "PICKUP":
            return { backgroundColor: "#3b82f6", borderColor: "#2563eb" }
        case "DELIVERY":
            return { backgroundColor: "#10b981", borderColor: "#059669" }
        case "SETUP":
            return { backgroundColor: "#f59e0b", borderColor: "#d97706" }
        case "ACTIVATION":
            return { backgroundColor: "#8b5cf6", borderColor: "#7c3aed" }
        case "TEARDOWN":
            return { backgroundColor: "#ef4444", borderColor: "#dc2626" }
        default:
            return { backgroundColor: "#6b7280", borderColor: "#4b5563" }
    }
}

/**
 * Converts a WorkOrderEvent to WorkOrderFormData for form editing.
 * Handles both WorkOrderEvent and WorkOrder types.
 */
export function toWorkOrderFormData(workOrder: WorkOrderEvent): WorkOrderFormData {
    return {
        id: workOrder.id,
        title: workOrder.title,
        fameNumber: workOrder.fameNumber,
        type: workOrder.type,
        status: workOrder.status,
        startDate: formatDateForInput(workOrder.start),
        endDate: formatDateForInput(workOrder.end),
        clientName: workOrder.clientName,
        clientEmail: workOrder.clientEmail || '',
        clientPhone: workOrder.clientPhone || '',
        pickupLocationId: workOrder.pickupLocationId || '',
        deliveryLocationId: workOrder.deliveryLocationId || '',
        assignedToId: '', // These need to be retrieved from the event's extendedProps or API
        supervisorId: ''
    }
}

/**
 * Formats a person's full name
 */
export function formatAssigneeName(person: Person): string {
    return `${person.firstName} ${person.lastName}`
}

/**
 * Formats a date for display in the UI
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
