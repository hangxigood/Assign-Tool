"use client"

import { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import dayGridPlugin from "@fullcalendar/daygrid"
import { Button } from "@/components/ui/button"
import { WorkOrderType, WorkOrderStatus } from "@prisma/client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addDays, parseISO } from "date-fns"

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
    rawDate: string
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
          
          // Get the date from startDate and adjust for timezone
          const originalDate = new Date(order.startDate);
          
          // Add one day to compensate for timezone difference
          const adjustedDate = addDays(originalDate, 1);
          
          console.log('Date handling:', {
            originalDate,
            adjustedDate
          });
          
          // Parse hours and minutes from startHour
          const [startHour, startMinute] = (order.startHour || '00:00').split(':').map(Number);
          const [endHour, endMinute] = (order.endHour || '00:00').split(':').map(Number);
          
          // Create event start date using adjusted date
          const eventStart = new Date(adjustedDate);
          eventStart.setHours(startHour, startMinute, 0, 0);
          
          // Create event end date
          const eventEnd = new Date(adjustedDate);
          if (order.endHour) {
            eventEnd.setHours(endHour, endMinute, 0, 0);
          } else {
            // If no end time specified, set duration to 1 hour
            eventEnd.setHours(startHour + 1, startMinute, 0, 0);
          }
          
          console.log('Event times:', {
            startHour,
            startMinute,
            eventStart: eventStart.toLocaleString(),
            eventEnd: eventEnd.toLocaleString()
          });

          const event = {
            id: order.id,
            title: `${order.type} - ${order.fameNumber} - ${order.clientName}`,
            start: eventStart,
            end: eventEnd,
            allDay: false,
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
              technician: order.technician || 'N/A',
              rawDate: adjustedDate.toISOString()
            }
          };
          
          console.log('Created calendar event:', event);
          return event;
        });
        
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
        slotDuration="01:00:00"
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }}
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