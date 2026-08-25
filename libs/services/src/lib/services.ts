import {
  IDevotee,
  ISadhanaRecord,
  IAnnouncement,
  ISevaOpportunity,
  LoginResponseDto,
  RegisterRequestDto,
  LoginRequestDto,
  UpdatePreferencesRequestDto,
  SadhanaLogRequestDto,
  CreateAnnouncementRequestDto,
  CreateSevaRequestDto,
} from '@temple/models';

export class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(path: string, method: string, body?: any): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP Error ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  // Auth Operations
  async register(dto: RegisterRequestDto): Promise<IDevotee> {
    return this.request<IDevotee>('/auth/register', 'POST', dto);
  }

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const res = await this.request<LoginResponseDto>('/auth/login', 'POST', dto);
    this.setToken(res.token);
    return res;
  }

  async getProfile(): Promise<IDevotee> {
    return this.request<IDevotee>('/auth/profile', 'GET');
  }

  async updatePreferences(dto: UpdatePreferencesRequestDto): Promise<IDevotee> {
    return this.request<IDevotee>('/auth/preferences', 'PUT', dto);
  }

  // Sadhana Operations
  async getSadhanaHistory(): Promise<ISadhanaRecord[]> {
    return this.request<ISadhanaRecord[]>('/sadhana/history', 'GET');
  }

  async getTodaySadhana(date: string): Promise<ISadhanaRecord | null> {
    return this.request<ISadhanaRecord | null>(`/sadhana/today?date=${date}`, 'GET');
  }

  async logSadhana(dto: SadhanaLogRequestDto): Promise<ISadhanaRecord> {
    return this.request<ISadhanaRecord>('/sadhana/log', 'POST', dto);
  }

  // Announcement Operations
  async getAnnouncements(official?: boolean): Promise<IAnnouncement[]> {
    const query = official !== undefined ? `?official=${official}` : '';
    return this.request<IAnnouncement[]>(`/announcements${query}`, 'GET');
  }

  async createAnnouncement(dto: CreateAnnouncementRequestDto): Promise<IAnnouncement> {
    return this.request<IAnnouncement>('/announcements', 'POST', dto);
  }

  // Seva Operations
  async getSevas(): Promise<ISevaOpportunity[]> {
    return this.request<ISevaOpportunity[]>('/sevas', 'GET');
  }

  async createSeva(dto: CreateSevaRequestDto): Promise<ISevaOpportunity> {
    return this.request<ISevaOpportunity>('/sevas', 'POST', dto);
  }

  async registerForSeva(id: number): Promise<ISevaOpportunity> {
    return this.request<ISevaOpportunity>(`/sevas/${id}/register`, 'POST');
  }
}

// Global Singleton Instance
export const apiService = new ApiService();

