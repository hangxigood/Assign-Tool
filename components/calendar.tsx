"use client"

import { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import dayGridPlugin from "@fullcalendar/daygrid"
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
  textColor?: string
  type: WorkOrderType
  status: WorkOrderStatus
  clientName: string
  fameNumber: string
  extendedProps: {
    type: WorkOrderType
    status: WorkOrderStatus
    clientName: string
    createdBy: string
    supervisor: string
    fameNumber: string
    startHour: string
    endHour: string
    location: string
    truckNumber?: string
    technician?: string
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

const getWorkOrderTypeInitials = (type: string) => {
  switch (type) {
    case 'PICKUP':
      return 'PU';
    case 'ACTIVATION':
      return 'AC';
    case 'TEARDOWN':
      return 'TD';
    case 'DELIVERY':
      return 'D';
    case 'SETUP':
      return 'SU';
    default:
      return type;
  }
};

const getWorkOrderTypeColor = (type: string) => {
  switch (type) {
    case 'PICKUP':
      return '#FFDAB9'; // Peach
    case 'ACTIVATION':
      return '#98FB98'; // Pale green
    case 'TEARDOWN':
      return '#DDA0DD'; // Plum
    case 'DELIVERY':
      return '#87CEEB'; // Sky blue
    case 'SETUP':
      return '#FFE4B5'; // Moccasin
    default:
      return '#E0E0E0'; // Light gray
  }
};

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
          
          // Parse start and end hours
          const [startHour, startMinute] = (order.startHour || '00:00').split(':').map(Number);
          const [endHour, endMinute] = (order.endHour || '00:00').split(':').map(Number);
          
          // Create date objects and set the correct hours
          const startDate = new Date(order.startDate);
          startDate.setHours(startHour, startMinute, 0);
          
          const endDate = new Date(order.startDate);  // Use same base date
          endDate.setHours(endHour, endMinute, 0);
          
          // If end time is before start time, assume it's next day
          if (endDate < startDate) {
            endDate.setDate(endDate.getDate() + 1);
          }
          
          console.log('Start date:', startDate.toLocaleString());
          console.log('End date:', endDate.toLocaleString());

          const event = {
            id: order.id,
            title: `${order.type} - ${order.fameNumber} - ${order.clientName}`,
            start: startDate,
            end: endDate,
            backgroundColor: getWorkOrderTypeColor(order.type),
            borderColor: 'transparent',
            textColor: '#000000',
            type: order.type,
            status: order.status,
            clientName: order.clientName,
            fameNumber: order.fameNumber,
            extendedProps: {
              type: order.type,
              status: order.status,
              fameNumber: order.fameNumber,
              clientName: order.clientName,
              createdBy: order.createdBy ? `${order.createdBy.firstName} ${order.createdBy.lastName}` : 'N/A',
              supervisor: order.supervisor ? `${order.supervisor.firstName} ${order.supervisor.lastName}` : 'N/A',
              startHour: order.startHour || 'N/A',
              endHour: order.endHour || 'N/A',
              location: order.location || 'N/A',
              truckNumber: order.truckNumber || 'N/A',
              technician: order.technician || 'N/A'
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
    <div className="h-full">
      <FullCalendar
        height="100%"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        timeZone="local"
        slotMinTime="06:00:00"
        slotMaxTime="20:00:00"
        events={events}
        editable={true}
        eventDrop={handleEventDrop}
        ref={(el) => {
          if (el) {
            setCalendarApi(el.getApi())
          }
        }}
        eventContent={(eventInfo) => {
          const event = eventInfo.event;
          return (
            <div className="p-1 text-xs" style={{
              backgroundColor: getWorkOrderTypeColor(event.extendedProps.type),
              border: 'none',
              height: '100%',
              width: '100%'
            }}>
              <div>{event.extendedProps.startHour} - {event.extendedProps.endHour || 'TBD'}</div>
              <div>
                {getWorkOrderTypeInitials(event.extendedProps.type)}-
                {event.extendedProps.fameNumber}-
                {event.extendedProps.clientName}
              </div>
              <div>
                {event.extendedProps.truckNumber || ''} {event.extendedProps.technician || ''}
              </div>
            </div>
          );
        }}
        eventClick={(info) => {
          onEventSelect(info.event as unknown as WorkOrderEvent)
        }}
      />
    </div>
  )
}
