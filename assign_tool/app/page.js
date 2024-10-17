"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import CalendarInterface from "../components/CalendarInterface";

export default function Home() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (session?.accessToken) {
      fetchEvents();
    }
  }, [session]);

  const fetchEvents = async () => {
    const response = await fetch("/api/calendar");
    if (response.ok) {
      const calendarEvents = await response.json();
      setEvents(calendarEvents);
    } else {
      console.error("Error fetching calendar events");
    }
  };

  const handleAddEvent = async (newEvent) => {
    const response = await fetch("/api/calendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    });

    if (response.ok) {
      fetchEvents(); // Refresh the events list
    } else {
      console.error("Error adding event");
    }
  };

  const handleEditEvent = async (editedEvent) => {
    const response = await fetch(`/api/calendar/${editedEvent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedEvent),
    });

    if (response.ok) {
      fetchEvents(); // Refresh the events list
    } else {
      console.error("Error editing event");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        {!session ? (
          <button onClick={() => signIn("google")}>Sign in with Google</button>
        ) : (
          <>
            <p>Welcome, {session.user.email}</p>
            <button onClick={() => signOut()}>Sign out</button>
            <CalendarInterface
              events={events}
              onAddEvent={handleAddEvent}
              onEditEvent={handleEditEvent}
            />
          </>
        )}
      </main>
      {/* ... (footer remains unchanged) */}
    </div>
  );
}
