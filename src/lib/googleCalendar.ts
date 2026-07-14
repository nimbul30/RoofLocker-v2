export interface CalendarEventInput {
  summary: string;
  description: string;
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
  attendeeEmail?: string;
  type: 'video' | 'voice';
}

// Error carrying the HTTP status so callers can detect expired tokens (401)
// and prompt the user to reconnect instead of failing silently.
export class CalendarApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'CalendarApiError';
    this.status = status;
  }
}

async function throwApiError(response: Response, fallback: string): Promise<never> {
  const errorData = await response.json().catch(() => ({}));
  throw new CalendarApiError(
    errorData.error?.message || `${fallback}: ${response.statusText}`,
    response.status
  );
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
    await throwApiError(response, 'Failed to create calendar event');
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
    await throwApiError(response, 'Failed to fetch calendar events');
  }

  const data = await response.json();
  return data.items || [];
}
