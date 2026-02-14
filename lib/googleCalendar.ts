
const CLIENT_ID = '516469946544-ntquecdojdpbmdq853tt2pb1ngh0redt.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

interface GoogleCalendarEvent {
  summary: string;
  location?: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

class GoogleCalendarService {
  private accessToken: string | null = null;
  private tokenClient: any = null;

  constructor() {
    this.accessToken = localStorage.getItem('google_access_token');
  }

  initTokenClient(callback: (token: string) => void) {
    if (typeof window === 'undefined' || !(window as any).google) return;

    this.tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response: any) => {
        if (response.access_token) {
          this.accessToken = response.access_token;
          localStorage.setItem('google_access_token', response.access_token);
          callback(response.access_token);
        }
      },
    });
  }

  connect() {
    return new Promise((resolve) => {
      this.initTokenClient((token) => resolve(token));
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  }

  disconnect() {
    this.accessToken = null;
    localStorage.removeItem('google_access_token');
  }

  isConnected() {
    return !!this.accessToken;
  }

  async createEvent(event: GoogleCalendarEvent) {
    if (!this.accessToken) return null;

    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (response.status === 401) {
        this.disconnect();
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar evento no Google Calendar:', error);
      return null;
    }
  }
}

export const googleCalendar = new GoogleCalendarService();
