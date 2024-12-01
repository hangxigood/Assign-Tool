'use client'

import { useState } from "react"
import { Calendar } from "@/components/calendar"
import { Sidebar } from "@/components/sidebar"
import { StatsBar } from "@/components/stats-bar"
import { EventDetailsSidebar } from "@/components/event-details-sidebar"
import { Menu, Plus, ListOrdered } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { UserNav } from "@/components/user-nav"

export default function Page() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const { data: session } = useSession()

  const userRole = session?.user?.role

  return (
    <>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 relative">
        {/* Barra de navegación principal */}
        <div className="w-full fixed top-0 z-50 bg-white dark:bg-gray-800 border-b">
          <div className="flex h-16 items-center px-4 justify-between">
            <Button
              variant="ghost"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/workorders')}
                className="hover:bg-primary/10"
              >
                <ListOrdered className="mr-2 h-4 w-4" /> View List
              </Button>
              {userRole !== 'SUPERVISOR' && userRole !== 'TECHNICIAN' && (
                <Button
                  onClick={() => router.push('/workorders/new')}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" /> Create New
                </Button>
              )}
            </div>

            {/* UserNav siempre visible */}
            <UserNav />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex w-full mt-16">
          <Sidebar 
            onEventSelect={setSelectedEvent} 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-hidden flex flex-col">
              <div className="p-4">
                <StatsBar />
              </div>
              <div className="flex-1 p-4 overflow-x-auto overflow-y-hidden mt-4 lg:mt-0">
                <Calendar onEventSelect={setSelectedEvent} selectedEvent={selectedEvent} />
              </div>
            </main>
          </div>

          {selectedEvent && (
            <EventDetailsSidebar
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          )}
        </div>
      </div>
    </>
  )
}
