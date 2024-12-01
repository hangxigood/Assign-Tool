'use client'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from 'lucide-react'
import { WorkOrderType, WorkOrderStatus } from "@prisma/client"
import { useEffect, useRef } from "react"
import { useRouter } from 'next/navigation'
import { format } from "date-fns"

export interface EventDetailsProps {
  event: {
    id: string
    title: string
    start: Date
    end: Date
    type: WorkOrderType
    status: WorkOrderStatus
    clientName: string
    fameNumber: string
    extendedProps: {
      type: WorkOrderType
      status: WorkOrderStatus
      fameNumber: string
      clientName: string
      createdBy: string
      supervisor: string
      startHour: string
      endHour: string
      location: string
      notes?: string
      documents?: {
        name: string
        url: string
      }[]
      truckNumber?: string
      technician?: string
    }
  }
  onClose: () => void
}

export function EventDetailsSidebar({ event, onClose }: EventDetailsProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const displayValue = (value: string | undefined | null) => {
    return value || 'N/A'
  }

  // Función segura para formatear fechas
  const formatDateSafe = (dateStr: string | Date | null | undefined) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const formattedDate = formatDateSafe(event?.start);

  if (!event) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div 
        ref={sidebarRef}
        className="absolute right-0 top-0 w-80 bg-white dark:bg-gray-800 h-full shadow-lg transform transition-transform duration-200 ease-in-out"
        style={{ transform: event ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Work Order Details</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onClose}>
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
              <p className="text-sm">{displayValue(event.type)}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">FAME Number</h3>
              <p className="text-sm">{displayValue(event.extendedProps.fameNumber)}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">Client</h3>
              <p className="text-sm">{displayValue(event.extendedProps.clientName)}</p>
            </div>
            <div className="flex items-center gap-2">
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
            <div className="mt-6">
              <h3 className="font-medium text-gray-500 mb-2">Notes</h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm whitespace-pre-wrap">
                  {displayValue(event.extendedProps.notes)}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-medium text-gray-500 mb-2">Documents</h3>
              <div className="space-y-2">
                {event.extendedProps.documents && event.extendedProps.documents.length > 0 ? (
                  event.extendedProps.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {doc.name}
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No documents attached</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
