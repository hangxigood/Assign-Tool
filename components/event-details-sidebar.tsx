'use client'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Edit } from 'lucide-react'
import { WorkOrderType, WorkOrderStatus } from "@prisma/client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from 'next/navigation'
import { WorkOrderEditDialog } from "./work-order-edit-dialog"
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
      truckNumber?: string
      technician?: string
    }
  }
  onClose: () => void
}

export function EventDetailsSidebar({ event, onClose }: EventDetailsProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [editDialogOpen, setEditDialogOpen] = useState(false)

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

  const handleEdit = () => {
    setEditDialogOpen(true)
  }

  const handleSave = async (updatedWorkOrder: any) => {
    // Implement save logic here
    setEditDialogOpen(false)
  }

  if (!event) return null;

  // Construir el título con el formato correcto usando extendedProps
  const title = `${event.extendedProps.type} - ${event.extendedProps.fameNumber} - ${event.extendedProps.clientName}`;
  
  // Función segura para formatear fechas
  const formatDateSafe = (dateStr: string | Date | null | undefined) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formattedDate = formatDateSafe(event.start);

  // Función para mostrar valores con fallback
  const displayValue = (value: any, fallback = 'N/A') => {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }
    return value;
  };

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
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-grow h-[calc(100vh-64px)]">
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-medium text-gray-500">Title</h3>
              <p className="text-sm">{title}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">Type</h3>
              <p className="text-sm">{displayValue(event.extendedProps.type)}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">FAME</h3>
              <p className="text-sm">{displayValue(event.extendedProps.fameNumber)}</p>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-500">Client</h3>
              <p className="text-sm">{displayValue(event.extendedProps.clientName)}</p>
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
      
      <WorkOrderEditDialog
        workOrder={event}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSave}
      />
    </div>
  );
}
