/**
 * @fileoverview Main application page component that integrates calendar, sidebar, and event details
 * Manages work order events display and interaction between different components
 */

'use client'

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/Sidebar"
import { EventDetailsSidebar } from "@/components/EventDetailsSidebar"
import { MobileNavigationMenu } from "@/components/MobileNavigationMenu"
import { useWorkOrders } from "@/hooks/useWorkOrders"
import { WorkOrderEvent } from "@/types/workorder"
import { MainContent } from "@/components/MainContent"

/**
 * Main page component of the application
 * Manages the layout and state of the work order calendar system
 * 
 * Features:
 * - Responsive sidebar navigation
 * - Work order calendar display
 * - Event selection and details view
 * - Stats bar for metrics
 * 
 * @returns React component that renders the main application layout
 * 
 * State management:
 * - sidebarOpen: Controls the visibility of the sidebar on mobile
 * - selectedEvent: Tracks the currently selected work order event
 * - Integrates with useWorkOrders hook for data fetching
 */
export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { events, isLoading, error, refetch } = useWorkOrders()
  const [selectedEvent, setSelectedEvent] = useState<WorkOrderEvent | null>(null)
  const [updateTrigger, setUpdateTrigger] = useState(0) // Add update trigger

  // Update selectedEvent when events change
  useEffect(() => {
    if (selectedEvent) {
      // Find the updated version of the selected event
      const updatedEvent = events.find(e => e.id === selectedEvent.id)
      setSelectedEvent(updatedEvent || null)
    }
  }, [events, selectedEvent])

  const handleUpdate = async () => {
    await refetch()
    setUpdateTrigger(prev => prev + 1) // Increment trigger to force StatsBar update
  }

  return (
    <>
      <MobileNavigationMenu
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <Sidebar
        onEventSelect={setSelectedEvent}
        selectedEvent={selectedEvent}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        workOrders={events}
        isLoading={isLoading}
      />

      <MainContent
        isLoading={isLoading}
        error={error}
        events={events}
        onEventSelect={setSelectedEvent}
        updateTrigger={updateTrigger}
      />

      <EventDetailsSidebar
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onUpdate={handleUpdate}
      />
    </>
  )
}
