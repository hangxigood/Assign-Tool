import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from 'lucide-react'
import { WorkOrderType, WorkOrderStatus } from "@prisma/client"
import { useEffect, useRef } from "react"

interface EventDetailsProps {
  event: {
    id: string
    title: string
    start: Date
    end: Date
    type: WorkOrderType
    status: WorkOrderStatus
    clientName: string
    extendedProps: {
      type: WorkOrderType
      status: WorkOrderStatus
      clientName: string
      assignedTo: string
      supervisor: string
    }
  } | null
  onClose: () => void
}

export function EventDetailsSidebar({ event, onClose }: EventDetailsProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-grow h-[calc(100vh-64px)]">
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-medium">Title</h3>
              <p>{event.title}</p>
            </div>
            <div>
              <h3 className="font-medium">Time</h3>
              <p>{event.start.toLocaleString()} - {event.end.toLocaleString()}</p>
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
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
