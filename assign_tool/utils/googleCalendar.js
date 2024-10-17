import { google } from "googleapis";

export async function getGoogleCalendarEvents(accessToken) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });

  try {
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.data.items;
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    throw error;
  }
}

export async function addGoogleCalendarEvent(accessToken, newEvent) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: newEvent.summary,
        start: {
          dateTime: new Date(newEvent.start).toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: new Date(newEvent.end).toISOString(),
          timeZone: "UTC",
        },
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding Google Calendar event:", error);
    throw error;
  }
}
