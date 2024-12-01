/**
 * @fileoverview Core types and utilities for work order management in the Docket application.
 * 
 * This file defines the type hierarchy and utilities for work order data throughout the application:
 * 
 * Type Hierarchy:
 * WorkOrderBase (Common Properties)
 *        ↓
 * WorkOrder (Main Application Model)
 *        ↓
 *    ┌────┴────┐
 *    ↓         ↓
 * WorkOrderFormData   WorkOrderEvent
 * (Form Handling)    (Calendar Display)
 * 
 * The hierarchy is designed to:
 * 1. Provide a consistent base structure (WorkOrderBase)
 * 2. Support different contexts (forms, calendar, general use)
 * 3. Include utility functions for data transformation and validation
 * 
 * Key Features:
 * - Date handling and formatting
 * - Type guards for runtime validation
 * - Conversion utilities between different work order types
 * - Calendar-specific formatting and styling
 */

import { WorkOrderType, WorkOrderStatus } from '@prisma/client'
import { User } from './user'

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
 * Main work order interface used throughout the application
 */
export interface WorkOrder extends WorkOrderBase {
    /** Scheduled start date and time */
    startDate: string | Date
    /** Scheduled end date and time */
    endDate: string | Date | null
    /** Information about the assigned technician */
    assignedTo: User
    /** Information about the supervising staff member */
    supervisor?: User
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

// Calendar-specific properties
interface CalendarEventProps {
    /** Formatted name of assigned technician */
    assignedTo: string
    /** Formatted name of supervisor */
    supervisor: string
    /** ID of assigned technician */
    assignedToId: string
    /** ID of supervisor */
    supervisorId?: string
}

/**
 * Work order structure optimized for calendar display
 */
export interface WorkOrderEvent extends WorkOrderBase {
    start: Date
    end: Date
    backgroundColor?: string
    borderColor?: string
    // Only include properties specific to calendar functionality
    extendedProps: CalendarEventProps & Pick<WorkOrderBase, 'type' | 'status' | 'clientName' | 'clientEmail' | 'clientPhone'>
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
 * Preserves the local timezone
 */
export function formatDateForInput(date: string | Date | null): string {
    if (!date) return ''
    const d = toDate(date)
    // Format in local time
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day}T${hours}:${minutes}`
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
            supervisor: workOrder.supervisor ? formatAssigneeName(workOrder.supervisor) : '',
            assignedToId: workOrder.assignedTo.id,
            supervisorId: workOrder.supervisor?.id
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
        assignedToId: workOrder.extendedProps.assignedToId,
        supervisorId: workOrder.extendedProps.supervisorId || ''
    }
}

/**
 * Formats a user's full name
 */
export function formatAssigneeName(user: User): string {
    return `${user.firstName} ${user.lastName}`
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
