
// Implementação baseada na Google API Client Library para JavaScript (gapi)
// Nota: Em um ambiente real, você deve substituir o CLIENT_ID pela sua chave do Google Cloud Console.

const CLIENT_ID = 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events.readonly';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

class GoogleCalendarService {
  private tokenClient: any = null;
  private accessToken: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('gcal_token');
    this.initClient();
  }

  private async initClient() {
    // Carrega o script do Google Identity Services dinamicamente
    if (typeof window === 'undefined') return;
    
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // @ts-ignore
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response: any) => {
          if (response.error !== undefined) {
            throw response;
          }
          this.accessToken = response.access_token;
          localStorage.setItem('gcal_token', response.access_token);
        },
      });
    };
    document.body.appendChild(script);
  }

  public isConnected(): boolean {
    return !!this.accessToken;
  }

  public async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.tokenClient) {
          this.initClient();
        }
        
        // Solicita o token ao usuário
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
        
        // Simulação de delay para o callback
        setTimeout(() => {
          if (this.accessToken) resolve();
          else reject('Falha na autenticação');
        }, 1000);
      } catch (err) {
        reject(err);
      }
    });
  }

  public disconnect() {
    this.accessToken = null;
    localStorage.removeItem('gcal_token');
    // @ts-ignore
    if (this.accessToken) {
      // @ts-ignore
      google.accounts.oauth2.revoke(this.accessToken, () => {
        console.log('Token revogado');
      });
    }
  }

  public async listEvents(timeMin: string, timeMax: string): Promise<any> {
    if (!this.accessToken) return null;

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );
      
      if (response.status === 401) {
        this.disconnect();
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error('Erro ao buscar eventos do Google:', err);
      return null;
    }
  }
}

export const googleCalendar = new GoogleCalendarService();
