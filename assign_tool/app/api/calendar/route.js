import { getGoogleCalendarEvents, addGoogleCalendarEvent } from "../../utils/googleCalendar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const events = await getGoogleCalendarEvents(session.accessToken);
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json({ error: "Error fetching calendar events" }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newEvent = await request.json();
    const createdEvent = await addGoogleCalendarEvent(session.accessToken, newEvent);
    return NextResponse.json(createdEvent);
  } catch (error) {
    console.error("Error adding calendar event:", error);
    return NextResponse.json({ error: "Error adding calendar event" }, { status: 500 });
  }
}
