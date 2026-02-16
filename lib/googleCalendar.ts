
const CLIENT_ID = '819652563805-c6s39aerm32jm9iblehbl8il7c46t12l.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  location?: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
}

class GoogleCalendarService {
  private accessToken: string | null = null;
  private tokenClient: any = null;

  constructor() {
    this.accessToken = localStorage.getItem('google_access_token');
  }

  private initTokenClient(callback: (token: string) => void, onError?: (err: any) => void) {
    if (typeof window === 'undefined' || !(window as any).google) {
      if (onError) onError('SDK_NOT_LOADED');
      return;
    }

    try {
      this.tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        ux_mode: 'popup',
        callback: (response: any) => {
          if (response.access_token) {
            this.accessToken = response.access_token;
            localStorage.setItem('google_access_token', response.access_token);
            callback(response.access_token);
          }
          if (response.error) {
            if (onError) onError(response);
          }
        },
      });
    } catch (err) {
      if (onError) onError(err);
    }
  }

  connect(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.initTokenClient(
        (token) => resolve(token),
        (err) => reject(err)
      );
      
      if (this.tokenClient) {
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        reject('TOKEN_CLIENT_NOT_READY');
      }
    });
  }

  disconnect() {
    this.accessToken = null;
    localStorage.removeItem('google_access_token');
    if (typeof window !== 'undefined' && (window as any).google && this.accessToken) {
      (window as any).google.accounts.oauth2.revoke(this.accessToken, () => {});
    }
  }

  isConnected() {
    return !!this.accessToken;
  }

  async listEvents(timeMin: string, timeMax: string) {
    if (!this.accessToken) return null;

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
        {
          headers: { 'Authorization': `Bearer ${this.accessToken}` }
        }
      );

      if (response.status === 401) {
        this.disconnect();
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar eventos do Google:', error);
      return null;
    }
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
      console.error('Erro ao criar evento no Google:', error);
      return null;
    }
  }
}

export const googleCalendar = new GoogleCalendarService();
