"use client";

/**
 * @fileoverview Main Calendar component for displaying work order events
 * Provides a comprehensive calendar view with event handling and responsive design
 *
 * @module Calendar
 * @category Components
 * @subcategory Calendar
 *
 * @requires react
 * @requires @fullcalendar/react
 * @requires @fullcalendar/timegrid
 * @requires @fullcalendar/interaction
 */

import { useCallback, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { CalendarProps } from "./types";
import { useCalendarApi, useEventDrop } from "./hooks";
import { EventContent } from "./event-content";

/**
 * Calendar component for displaying and interacting with work order events
 *
 * @component Calendar
 * @description Renders a full-featured calendar with work order events
 *
 * @param {CalendarProps} props - The properties for the Calendar component
 * @param {function} props.onEventSelect - Callback function when an event is selected
 * @param {WorkOrderEvent[]} props.events - Array of work order events to display
 *
 * @returns {JSX.Element} A fully interactive calendar component
 *
 * @example
 * <Calendar
 *   events={workOrderEvents}
 *   onEventSelect={handleEventSelection}
 * />
 */
export function Calendar({
  onEventSelect,
  events,
}: CalendarProps): JSX.Element {
  // Create a ref for the FullCalendar component
  const calendarRef = useRef<FullCalendar | null>(null);

  // Use the custom hook for calendar API management
  const { setCalendarApi, handleResize } = useCalendarApi();

  // Use effect to set calendar API when ref changes
  useEffect(() => {
    if (calendarRef.current) {
      setCalendarApi(calendarRef.current.getApi());
    }
  }, [calendarRef]);

  const handleEventDrop = useEventDrop();

  const calendarOptions = {
    height: "100%",
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: "timeGridWeek",
    editable: true,
    headerToolbar: {
      left: "prev,today,next",
      center: "title",
      right: "timeGridDay,timeGridWeek,listView",
    },
    customButtons: {
      listView: {
        text: "View List",
        click: () => {
          window.location.href = "/workorders";
        },
      },
    },
    views: {
      timeGridWeek: {
        titleFormat: { month: "short", day: "numeric" } as const,
        dayHeaderFormat: { weekday: "short", day: "numeric" } as const,
        slotDuration: "01:00:00",
      },
      timeGridDay: {
        titleFormat: { month: "short", day: "numeric" } as const,
        slotDuration: "01:00:00",
      },
    },
    allDaySlot: false,
  };

  // Memoized event click handler to find and select the original work order event
  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      const originalEvent = events.find((e) => e.id === info.event.id);
      if (originalEvent) {
        onEventSelect(originalEvent);
      }
    },
    [events, onEventSelect]
  );

  return (
    <FullCalendar
      ref={calendarRef}
      {...calendarOptions}
      events={events}
      eventDrop={handleEventDrop}
      eventClick={handleEventClick}
      windowResize={handleResize}
      eventContent={EventContent}
    />
  );
}
