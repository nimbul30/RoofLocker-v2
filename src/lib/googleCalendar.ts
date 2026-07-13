export interface CalendarEventInput {
  summary: string;
  description: string;
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
  attendeeEmail?: string;
  type: 'video' | 'voice';
}

export async function createCalendarEvent(accessToken: string, input: CalendarEventInput) {
  const event = {
    summary: input.summary,
    description: input.description,
    location: input.type === 'video' ? 'RoofLocker Secure Video Portal' : 'RoofLocker Secure Voice Line',
    start: {
      dateTime: input.startDateTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: input.endDateTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    attendees: input.attendeeEmail ? [{ email: input.attendeeEmail }] : [],
    reminders: {
      useDefault: true,
    }
  };

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create calendar event: ${response.statusText}`);
  }

  return response.json();
}

export async function listCalendarEvents(accessToken: string) {
  // Fetch events starting from today
  const timeMin = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
    timeMin
  )}&maxResults=15&orderBy=startTime&singleEvents=true`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch calendar events: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || [];
}
