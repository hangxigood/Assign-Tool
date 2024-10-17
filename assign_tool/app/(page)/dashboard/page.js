'use client'

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';

export default function Dashboard() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      const res = await fetch('/api/assignments');
      const data = await res.json();
      setAssignments(data);
    };

    fetchAssignments();
  }, []);

  const handleEventClick = (info) => {
    // Handle event click (e.g., show assignment details)
    console.log('Event clicked:', info.event);
  };

  const handleDateSelect = (info) => {
    // Handle date selection (e.g., open new assignment form)
    console.log('Date selected:', info.startStr);
  };

  if (!session) {
    return <p>Access denied. Please log in.</p>;
  }

  const formattedEvents = assignments.map(a => ({
    id: a.id,
    title: a.title,
    start: a.startTime,
    end: a.endTime,
    extendedProps: {
      technician: a.technician.name,
      description: a.description
    }
  }));

  return (
    <div>
      <h1>Dashboard</h1>
      <Calendar 
        events={formattedEvents}
        onEventClick={handleEventClick}
        onDateSelect={handleDateSelect}
      />
    </div>
  );
}
