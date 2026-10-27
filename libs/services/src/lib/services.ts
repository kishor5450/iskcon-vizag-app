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
import { CommonAxiosService } from '../core';
import { AuthService } from '../auth';
import { SadhanaService } from '../sadhana';
import { AnnouncementService } from '../announcement';
import { SevaService } from '../seva';

export class ApiService extends CommonAxiosService {
  public auth: AuthService;
  public sadhana: SadhanaService;
  public announcement: AnnouncementService;
  public seva: SevaService;

  constructor(baseUrl?: string) {
    super(baseUrl);
    this.auth = new AuthService(this.URL);
    this.sadhana = new SadhanaService(this.URL);
    this.announcement = new AnnouncementService(this.URL);
    this.seva = new SevaService(this.URL);
  }

  override setToken(token: string | null): void {
    super.setToken(token);
    this.auth.setToken(token);
    this.sadhana.setToken(token);
    this.announcement.setToken(token);
    this.seva.setToken(token);
  }

  override setBaseUrl(url: string): void {
    super.setBaseUrl(url);
    this.auth.setBaseUrl(url);
    this.sadhana.setBaseUrl(url);
    this.announcement.setBaseUrl(url);
    this.seva.setBaseUrl(url);
  }

  // Auth Operations
  async register(dto: RegisterRequestDto): Promise<IDevotee> {
    return this.auth.register(dto);
  }

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.auth.login(dto);
  }

  async getProfile(): Promise<IDevotee> {
    return this.auth.getProfile();
  }

  async updatePreferences(dto: UpdatePreferencesRequestDto): Promise<IDevotee> {
    return this.auth.updatePreferences(dto);
  }

  // Sadhana Operations
  async getSadhanaHistory(): Promise<ISadhanaRecord[]> {
    return this.sadhana.getHistory();
  }

  async getTodaySadhana(date: string): Promise<ISadhanaRecord | null> {
    return this.sadhana.getTodaySadhana(date);
  }

  async logSadhana(dto: SadhanaLogRequestDto): Promise<ISadhanaRecord> {
    return this.sadhana.logSadhana(dto);
  }

  // Announcement Operations
  async getAnnouncements(official?: boolean): Promise<IAnnouncement[]> {
    return this.announcement.getAll(official);
  }

  async createAnnouncement(dto: CreateAnnouncementRequestDto): Promise<IAnnouncement> {
    return this.announcement.create(dto);
  }

  // Seva Operations
  async getSevas(): Promise<ISevaOpportunity[]> {
    return this.seva.getAll();
  }

  async createSeva(dto: CreateSevaRequestDto): Promise<ISevaOpportunity> {
    return this.seva.create(dto);
  }

  async registerForSeva(id: number): Promise<ISevaOpportunity> {
    return this.seva.register(id);
  }
}

// Global Singleton Instance
export const apiService = new ApiService();
