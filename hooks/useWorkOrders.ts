/**
 * @fileoverview Hook for fetching and managing work orders as calendar events
 * Handles loading states, error handling, and validation of work orders
 */

import { useState, useEffect } from 'react'
import { WorkOrderEvent, WorkOrder, toWorkOrderEvent, isValidWorkOrder } from "@/types/workorder"

/**
 * Hook to fetch and manage work orders
 * 
 * @returns An object containing:
 * - events: Array of work order events
 * - isLoading: Boolean indicating if fetch is in progress
 * - error: Error object if fetch failed, null otherwise
 * - refetch: Function to manually trigger a refresh of work orders
 * 
 * @example
 * ```tsx
 * const { events, isLoading, error, refetch } = useWorkOrders();
 * 
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 * 
 * return <Calendar events={events} />;
 * ```
 */
export function useWorkOrders(): {
  events: WorkOrderEvent[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [events, setEvents] = useState<WorkOrderEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchWorkOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/workorders')
      if (!response.ok) throw new Error('Failed to fetch work orders')
      const workOrders = await response.json()
      
      if (process.env.NODE_ENV === 'development') {
        const validWorkOrders = workOrders.filter((order: WorkOrder) => isValidWorkOrder(order))
        if (validWorkOrders.length !== workOrders.length) {
          console.warn('Some work orders failed validation')
        }
        setEvents(validWorkOrders.map(toWorkOrderEvent))
      } else {
        try {
          setEvents(workOrders.map(toWorkOrderEvent))
        } catch (error) {
          console.error('Error converting work orders to events:', error)
          setError(error instanceof Error ? error : new Error('Unknown error'))
        }
      }
    } catch (error) {
      console.error('Error fetching work orders:', error)
      setError(error instanceof Error ? error : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkOrders()
  }, [])

  return { events, isLoading, error, refetch: fetchWorkOrders }
}