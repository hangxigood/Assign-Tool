/**
 * @fileoverview Main application page component that integrates calendar, sidebar, and event details
 * Manages work order events display and interaction between different components
 */

'use client'

import { useState, useEffect } from "react"
import { Calendar } from "@/components/Calendar"
import { Sidebar } from "@/components/Sidebar"
import { StatsBar } from "@/components/StatsBar"
import { EventDetailsSidebar } from "@/components/EventDetailsSidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWorkOrders } from "@/hooks/useWorkOrders"
import { WorkOrderEvent } from "@/types/workorder"

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
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 relative">
        <Button
          variant="ghost"
          className="lg:hidden absolute top-4 left-4 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <Sidebar 
          onEventSelect={setSelectedEvent}
          selectedEvent={selectedEvent}
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          workOrders={events}
          isLoading={isLoading}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 p-4 overflow-x-auto overflow-y-hidden mt-14 lg:mt-0">
              {error && <div className="text-red-500">Error loading work orders</div>}
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <Calendar 
                  onEventSelect={setSelectedEvent} 
                  events={events} 
                />
              )}
            </div>
            <StatsBar trigger={updateTrigger} />
          </main>
        </div>
      </div>
      <EventDetailsSidebar 
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onUpdate={handleUpdate}
      />
    </>
  )
}
