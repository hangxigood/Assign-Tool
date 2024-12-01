'use client'

/**
 * @fileoverview Sidebar component for displaying work order event details
 * @module EventDetailsSidebar
 */

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Edit } from 'lucide-react'
import { WorkOrderEvent, formatDateTime } from "@/types/workorder"
import { useEffect, useRef, useState } from "react"
import { useRouter } from 'next/navigation'
import { WorkOrderEditDialog } from "./WorkOrderEditDialog"

/**
 * Props for the EventDetailsSidebar component
 */
interface EventDetailsSidebarProps {
  /** The work order event to display details for */
  event: WorkOrderEvent | null
  /** Callback function when the sidebar is closed */
  onClose: () => void
}

/**
 * Sidebar component that displays detailed information about a selected work order event
 * @component
 * @param {EventDetailsSidebarProps} props - Component props
 */
export function EventDetailsSidebar({ event, onClose }: EventDetailsSidebarProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editDialogOpen) return; // Don't close if dialog is open
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, editDialogOpen]); // Add editDialogOpen to dependencies

  const handleEdit = () => {
    setEditDialogOpen(true)
  }

  const handleSave = () => {
    // Refresh the page to show updated data
    router.refresh();
  }

  if (!event) return null;

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
              <h3 className="font-medium">Title</h3>
              <p>{event.title}</p>
            </div>
            <div>
              <h3 className="font-medium">Time</h3>
              <p>{formatDateTime(event.start)} - {formatDateTime(event.end)}</p>
            </div>
            <div>
              <h3 className="font-medium">Type</h3>
              <p>{event.extendedProps.type}</p>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <p>{event.extendedProps.status}</p>
            </div>
            <div>
              <h3 className="font-medium">Client</h3>
              <p>{event.extendedProps.clientName}</p>
            </div>
            <div>
              <h3 className="font-medium">Assigned To</h3>
              <p>{event.extendedProps.assignedTo}</p>
            </div>
            <div>
              <h3 className="font-medium">Supervisor</h3>
              <p>{event.extendedProps.supervisor}</p>
            </div>
            <div>
              <h3 className="font-medium">Client Phone</h3>
              <p>{event.extendedProps.clientPhone}</p>
            </div>
            <div>
              <h3 className="font-medium">Client Email</h3>
              <p>{event.extendedProps.clientEmail}</p>
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
