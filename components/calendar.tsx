"use client"

import { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Button } from "@/components/ui/button"
import { WorkOrderType, WorkOrderStatus } from "@prisma/client"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface WorkOrderEvent {
  id: string
  title: string
  start: Date
  end: Date
  backgroundColor?: string
  borderColor?: string
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
}

const getEventColor = (type: WorkOrderType) => {
  switch (type) {
    case "PICKUP":
      return { backgroundColor: "#3b82f6", borderColor: "#2563eb" }
    case "DELIVERY":
      return { backgroundColor: "#10b981", borderColor: "#059669" }
    case "SETUP":
      return { backgroundColor: "#f59e0b", borderColor: "#d97706" }
    case "ACTIVATION":
      return { backgroundColor: "#8b5cf6", borderColor: "#7c3aed" }
    case "TEARDOWN":
      return { backgroundColor: "#ef4444", borderColor: "#dc2626" }
    default:
      return { backgroundColor: "#6b7280", borderColor: "#4b5563" }
  }
}

export function Calendar({
  onEventSelect,
  selectedEvent
}: {
  onEventSelect: (event: WorkOrderEvent | null) => void
  selectedEvent: WorkOrderEvent | null
}) {
  const [view, setView] = useState<"timeGridDay" | "timeGridWeek">("timeGridDay")
  const [events, setEvents] = useState<WorkOrderEvent[]>([])
  const [calendarApi, setCalendarApi] = useState<any>(null)
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        console.log('Fetching work orders...');
        const response = await fetch('/api/workorders');
        if (!response.ok) throw new Error('Failed to fetch work orders');
        const workOrders = await response.json();
        console.log('Fetched work orders:', workOrders);
        
        const calendarEvents = workOrders.map((order: any) => {
          console.log('Processing order:', order);
          const colors = getEventColor(order.type);
          
          // Convert UTC dates to local timezone
          const startDate = new Date(order.startDate);
          const endDate = order.endDate 
            ? new Date(order.endDate)
            : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

          const event = {
            id: order.id,
            title: `${order.fameNumber} - ${order.clientName}`,
            start: startDate,
            end: endDate,
            ...colors,
            type: order.type,
            status: order.status,
            clientName: order.clientName,
            extendedProps: {
              type: order.type,
              status: order.status,
              clientName: order.clientName,
              assignedTo: `${order.assignedTo.firstName} ${order.assignedTo.lastName}`,
              supervisor: order.supervisor ? `${order.supervisor.firstName} ${order.supervisor.lastName}` : ''
            }
          };
          console.log('Created event:', event);
          return event;
        });
        
        console.log('Setting calendar events:', calendarEvents);
        setEvents(calendarEvents);
      } catch (error) {
        console.error('Error fetching work orders:', error);
      }
    };

    fetchWorkOrders();
  }, [])

  const handleEventDrop = async (info: any) => {
    const { event } = info
    try {
      const response = await fetch(`/api/workorders/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: event.start,
          endDate: event.end,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update work order')
        info.revert()
      }
    } catch (error) {
      console.error('Error updating work order:', error)
      info.revert()
    }
  }

  const handlePrevClick = () => {
    if (calendarApi) {
      calendarApi.prev()
      setCurrentDate(calendarApi.getDate())
    }
  }

  const handleNextClick = () => {
    if (calendarApi) {
      calendarApi.next()
      setCurrentDate(calendarApi.getDate())
    }
  }

  const handleTodayClick = () => {
    if (calendarApi) {
      calendarApi.today()
      setCurrentDate(calendarApi.getDate())
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg shadow p-4 h-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant={view === "timeGridDay" ? "default" : "outline"}
              onClick={() => {
                setView("timeGridDay")
                if (calendarApi) {
                  calendarApi.changeView("timeGridDay")
                }
              }}
            >
              Day
            </Button>
            <Button
              variant={view === "timeGridWeek" ? "default" : "outline"}
              onClick={() => {
                setView("timeGridWeek")
                if (calendarApi) {
                  calendarApi.changeView("timeGridWeek")
                }
              }}
            >
              Week
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevClick}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleTodayClick}
            >
              {view === "timeGridDay" ? "Today" : "This Week"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextClick}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm font-medium">
            {formatDate(currentDate)}
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView={view}
            headerToolbar={false}
            allDaySlot={false}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            events={events}
            editable={true}
            eventDrop={handleEventDrop}
            ref={(el) => {
              if (el) {
                setCalendarApi(el.getApi())
              }
            }}
            eventContent={(arg) => {
              const event = arg.event
              return (
                <div className="p-1">
                  <div className="font-medium">{event.title}</div>
                  <div>Assigned: {event.extendedProps.assignedTo}</div>
                  <div>Supervisor: {event.extendedProps.supervisor}</div>
                </div>
              )
            }}
            eventClick={(info) => {
              onEventSelect(info.event as unknown as WorkOrderEvent)
            }}
          />
        </div>
      </div>
    </div>
  )
}
