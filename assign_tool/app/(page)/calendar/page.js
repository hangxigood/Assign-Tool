'use client'

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';

export default function CalendarPage() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (session) {
        const res = await fetch('/api/assignments');
        const data = await res.json();
        setAssignments(data);
      }
    };

    fetchAssignments();
  }, [session]);

  if (!session) {
    return <p>Access denied. Please log in.</p>;
  }

  const formattedEvents = assignments.map(a => ({
    id: a.id,
    title: a.title,
    start: a.startTime,
    end: a.endTime,
    extendedProps: {
      description: a.description,
      technicianName: a.technician.name,
      technicianEmail: a.technician.email
    }
  }));

  const isAdminOrManager = session.user.role === 'ADMIN' || session.user.role === 'MANAGER';

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">
        {isAdminOrManager ? 'All Assignments' : 'My Assignments'}
      </h1>
      <Calendar 
        events={formattedEvents}
        onEventClick={(info) => {
          // You can add event details display logic here
          console.log('Event clicked:', info.event);
        }}
        onDateSelect={() => {}}
        isAdminOrManager={isAdminOrManager}
      />
    </div>
  );
}
