'use client'

import { useState, useEffect } from "react"
import { Calendar } from "@/components/Calendar"
import { Sidebar } from "@/components/Sidebar"
import { StatsBar } from "@/components/StatsBar"
import { EventDetailsSidebar } from "@/components/EventDetailsSidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WorkOrderEvent, WorkOrder, toWorkOrderEvent, isValidWorkOrder } from "@/types/workorder"

export default function Page() {
  const [selectedEvent, setSelectedEvent] = useState<WorkOrderEvent | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [events, setEvents] = useState<WorkOrderEvent[]>([])

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await fetch('/api/workorders');
        if (!response.ok) throw new Error('Failed to fetch work orders');
        const workOrders = await response.json();
        
        // Light validation in production, full validation in development
        if (process.env.NODE_ENV === 'development') {
          const validWorkOrders = workOrders.filter((order: WorkOrder) => isValidWorkOrder(order));
          if (validWorkOrders.length !== workOrders.length) {
            console.warn('Some work orders failed validation');
          }
          setEvents(validWorkOrders.map(toWorkOrderEvent));
        } else {
          // In production, trust the API types but catch any runtime errors
          try {
            setEvents(workOrders.map(toWorkOrderEvent));
          } catch (error) {
            console.error('Error converting work orders to events:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching work orders:', error);
      }
    };

    fetchWorkOrders();
  }, []);

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
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 p-4 overflow-x-auto overflow-y-hidden mt-14 lg:mt-0">
              <Calendar onEventSelect={setSelectedEvent} events={events} />
            </div>
            <StatsBar />
          </main>
        </div>
      </div>
      <EventDetailsSidebar
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  )
}
