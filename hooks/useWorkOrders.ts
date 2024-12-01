import { useState, useEffect } from 'react'
import { WorkOrderEvent, WorkOrder, toWorkOrderEvent, isValidWorkOrder } from "@/types/workorder"

export function useWorkOrders() {
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