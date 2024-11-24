import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from 'lucide-react'

interface EventDetailsProps {
  event: {
    id: string
    title: string
    start: Date
    end: Date
    location: string
    assignedTo: string
    notes: string
    documents: string[]
  } | null
  onClose: () => void
}

export function EventDetailsSidebar({ event, onClose }: EventDetailsProps) {
  if (!event) return null

  return (
    <div className="w-80 border-l bg-white dark:bg-gray-800 h-full overflow-hidden flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Event Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-grow">
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
            <h3 className="font-medium">Location</h3>
            <p>{event.location}</p>
          </div>
          <div>
            <h3 className="font-medium">Assigned To</h3>
            <p>{event.assignedTo}</p>
          </div>
          <div>
            <h3 className="font-medium">Notes</h3>
            <p>{event.notes}</p>
          </div>
          <div>
            <h3 className="font-medium">Documents</h3>
            <ul className="list-disc list-inside">
              {event.documents.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

