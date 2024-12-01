/**
 * @fileoverview Custom hook for managing selected work order state across different data representations
 * 
 * This hook manages the state of the currently selected work order in both calendar event
 * and form data formats. It handles the conversion between these formats automatically,
 * ensuring that components always receive the data in their preferred format.
 * 
 * Type Flow:
 * WorkOrderEvent (Calendar) ←→ WorkOrderFormData (Forms)
 */

import { useState, useCallback } from 'react'
import { WorkOrderEvent, WorkOrderFormData, toWorkOrderFormData } from '@/types/workorder'

/**
 * Interface defining the return value of useSelectedWorkOrder hook
 * @interface
 */
interface UseSelectedWorkOrder {
  /** Currently selected work order in calendar event format */
  selectedEvent: WorkOrderEvent | null
  /** Currently selected work order in form data format */
  selectedFormData: WorkOrderFormData | null
  /** Function to update the selected work order */
  setSelectedWorkOrder: (event: WorkOrderEvent | null) => void
  /** Function to clear the current selection */
  clearSelection: () => void
}

/**
 * Custom hook for managing selected work order state
 * 
 * This hook maintains two synchronized states:
 * 1. Calendar event format (WorkOrderEvent) - Used by calendar and timeline views
 * 2. Form data format (WorkOrderFormData) - Used by forms and detail views
 * 
 * When a work order is selected, it automatically converts between these formats
 * using the toWorkOrderFormData utility function.
 * 
 * User Interaction (e.g., click on calendar)
 *           ↓
 * setSelectedWorkOrder(event: WorkOrderEvent | null)
 *           ↓
 *     ┌─────┴─────┐
 *     ↓           ↓
 * selectedEvent  →  selectedFormData
 * (Calendar)       (Form)
 *     ↓           ↓
 * Calendar View    Form/Details View
 * 
 * @returns {UseSelectedWorkOrder} Object containing selected work order states and update functions
 */
export function useSelectedWorkOrder(): UseSelectedWorkOrder {
  const [selectedEvent, setSelectedEvent] = useState<WorkOrderEvent | null>(null)
  const [selectedFormData, setSelectedFormData] = useState<WorkOrderFormData | null>(null)

  const setSelectedWorkOrder = useCallback((event: WorkOrderEvent | null) => {
    setSelectedEvent(event)
    setSelectedFormData(event ? toWorkOrderFormData(event) : null)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedEvent(null)
    setSelectedFormData(null)
  }, [])

  return {
    selectedEvent,
    selectedFormData,
    setSelectedWorkOrder,
    clearSelection
  }
}