'use client'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Edit } from 'lucide-react'
import { WorkOrderType, WorkOrderStatus } from "@prisma/client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from 'next/navigation'
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { SupervisorEditDialog } from "./supervisor-edit-dialog"
import { toast } from "sonner"

export interface EventDetailsProps {
  event: {
    id: string
    title: string
    start: string
    end: string
    clientName: string
    fameNumber: string
    extendedProps: {
      createdBy: string
      supervisor: string
      startHour: string
      endHour: string
      location: string
      truckNumber: string
      technician: string
      type: string
      status: string
      [key: string]: string
    }
  }
  onClose: () => void
}

export function EventDetailsSidebar({ event, onClose }: EventDetailsProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { data: session } = useSession()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isSupervisor = session?.user?.role === 'SUPERVISOR'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (!editDialogOpen) {
          onClose()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose, editDialogOpen])

  const handleSave = async (updatedData: { truckNumber: string; technician: string }) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/workorders/${event.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update work order')
      }

      const data = await response.json()
      toast.success('Work order updated successfully')
      router.refresh()
      setEditDialogOpen(false)
    } catch (error: any) {
      console.error('Error updating work order:', error)
      toast.error(error.message || 'Failed to update work order')
    } finally {
      setIsLoading(false)
    }
  }

  if (!event) return null

  const formatDateSafe = (dateStr: string | Date | null | undefined) => {
    if (!dateStr) return 'N/A'
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      return format(date, 'MMMM d, yyyy')
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid Date'
    }
  }

  const formattedDate = formatDateSafe(event.start)

  const displayValue = (value: any, fallback = 'N/A') => {
    if (value === null || value === undefined || value === '') {
      return fallback
    }
    return value
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditDialogOpen(true)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50" onClick={(e) => e.stopPropagation()}>
      <div 
        ref={sidebarRef}
        className="absolute right-0 top-0 w-80 bg-white dark:bg-gray-800 h-full shadow-lg transform transition-transform duration-200 ease-in-out"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Work Order Details</h2>
          <div className="flex gap-2">
            {isSupervisor && (
              <Button variant="ghost" size="icon" onClick={handleEditClick} disabled={isLoading}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-grow h-[calc(100vh-64px)]">
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-medium text-gray-500">Title</h3>
              <p className="text-sm">{event.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">Type</h3>
              <p className="text-sm">{displayValue(event.extendedProps.type)}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">FAME</h3>
              <p className="text-sm">{displayValue(event.fameNumber)}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">Client</h3>
              <p className="text-sm">{displayValue(event.clientName)}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Date</h3>
              <p className="text-sm">{formattedDate}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">Start Hour</h3>
              <p className="text-sm">{displayValue(event.extendedProps.startHour)}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">End Hour</h3>
              <p className="text-sm">{displayValue(event.extendedProps.endHour)}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">Location</h3>
              <p className="text-sm">{displayValue(event.extendedProps.location)}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">Created By</h3>
              <p className="text-sm">{displayValue(event.extendedProps.createdBy)}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">Supervisor</h3>
              <p className="text-sm">{displayValue(event.extendedProps.supervisor)}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">Truck Number</h3>
              <p className="text-sm">{displayValue(event.extendedProps.truckNumber)}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">Technician</h3>
              <p className="text-sm">{displayValue(event.extendedProps.technician)}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">Status</h3>
              <p className="text-sm">{displayValue(event.extendedProps.status)}</p>
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {isSupervisor && (
        <SupervisorEditDialog
          workOrder={event}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSave}
        />
      )}
    </div>
  )
}