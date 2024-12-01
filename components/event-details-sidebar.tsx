'use client'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Edit, FileText, MessageSquare } from 'lucide-react'
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
      documents: Array<{
        id: string
        name: string
        url: string
      }>
      notes: Array<{
        id: string
        content: string
        createdAt: string
        user: {
          firstName: string
          lastName: string
        }
      }>
      rawDate: string
      [key: string]: any
    }
  }
  onClose: () => void
}

export function EventDetailsSidebar({ event: initialEvent, onClose }: EventDetailsProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { data: session, status } = useSession()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [event, setEvent] = useState(initialEvent)

  const isSupervisor = session?.user?.role === 'SUPERVISOR'

  useEffect(() => {
    console.log('Session Status:', status)
    console.log('Session Data:', session)
    console.log('User Role:', session?.user?.role)
    console.log('Is Supervisor:', isSupervisor)
  }, [session, status, isSupervisor])

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
      
      setEvent({
        ...event,
        extendedProps: {
          ...event.extendedProps,
          truckNumber: updatedData.truckNumber,
          technician: updatedData.technician,
          supervisor: data.supervisor ? `${data.supervisor.firstName} ${data.supervisor.lastName}` : 'N/A',
        },
      })

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
      const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
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
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Work Order Details</h2>
            <div className="flex items-center space-x-2">
              {isSupervisor && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditDialogOpen(true)
                  }}
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Work Order Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Type:</div>
                  <div>{event.extendedProps.type}</div>
                  <div className="text-muted-foreground">Status:</div>
                  <div>{event.extendedProps.status}</div>
                  <div className="text-muted-foreground">FAME Number:</div>
                  <div>{event.extendedProps.fameNumber}</div>
                  <div className="text-muted-foreground">Client:</div>
                  <div>{event.extendedProps.clientName}</div>
                  <div className="text-muted-foreground">Created By:</div>
                  <div>{event.extendedProps.createdBy}</div>
                  <div className="text-muted-foreground">Date:</div>
                  <div>{format(new Date(event.extendedProps.rawDate), 'PPP')}</div>
                  <div className="text-muted-foreground">Time:</div>
                  <div>{event.extendedProps.startHour} - {event.extendedProps.endHour}</div>
                  <div className="text-muted-foreground">Location:</div>
                  <div>{event.extendedProps.location}</div>
                  <div className="text-muted-foreground">Supervisor:</div>
                  <div>{event.extendedProps.supervisor}</div>
                  <div className="text-muted-foreground">Truck Number:</div>
                  <div>{event.extendedProps.truckNumber}</div>
                  <div className="text-muted-foreground">Technician:</div>
                  <div>{event.extendedProps.technician}</div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-500">Documents</h3>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </div>
                {event.extendedProps.documents?.length > 0 ? (
                  <div className="space-y-2">
                    {event.extendedProps.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <span className="text-sm truncate">{doc.name}</span>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No documents attached</p>
                )}
              </div>

              {/* Notes Section */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-500">Notes</h3>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
                {event.extendedProps.notes?.length > 0 ? (
                  <div className="space-y-2">
                    {event.extendedProps.notes.map((note) => (
                      <div key={note.id} className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <p className="text-sm">{note.content}</p>
                        <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                          <span>{`${note.user.firstName} ${note.user.lastName}`}</span>
                          <span>{format(new Date(note.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No notes added</p>
                )}
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
    </div>
  )
}