import {
  IDevotee,
  ISadhanaRecord,
  LoginResponseDto,
  RegisterRequestDto,
  LoginRequestDto,
  UpdatePreferencesRequestDto,
  SadhanaLogRequestDto,
  CreateAnnouncementRequestDto,
  CreateSevaRequestDto,
  GetAllAnnouncementsResponse,
  CreateAnnouncementResponse,
  DeleteAnnouncementResponse,
  GetAllSevasResponse,
  CreateSevaResponse,
  RegisterForSevaResponse,
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
  async registerDevotee(dto: RegisterRequestDto): Promise<IDevotee> {
    return this.auth.registerDevotee(dto);
  }

  async loginDevotee(dto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.auth.loginDevotee(dto);
  }

  async getDevoteeProfile(): Promise<IDevotee> {
    return this.auth.getDevoteeProfile();
  }

  async updateDevoteePreferences(
    dto: UpdatePreferencesRequestDto,
  ): Promise<IDevotee> {
    return this.auth.updateDevoteePreferences(dto);
  }

  async getAllDevotees(): Promise<IDevotee[]> {
    return this.auth.getAllDevotees();
  }

  async updateDevoteeAvatar(avatarUrl: string): Promise<IDevotee> {
    return this.auth.updateDevoteeAvatar(avatarUrl);
  }

  // Sadhana Operations
  async getSadhanaHistory(): Promise<ISadhanaRecord[]> {
    return this.sadhana.getSadhanaHistory();
  }

  async getTodaySadhanaRecord(date: string): Promise<ISadhanaRecord | null> {
    return this.sadhana.getTodaySadhanaRecord(date);
  }

  async logSadhanaRecord(dto: SadhanaLogRequestDto): Promise<ISadhanaRecord> {
    return this.sadhana.logSadhanaRecord(dto);
  }

  async getCommunitySadhanaStats() {
    return this.sadhana.getCommunitySadhanaStats();
  }

  // Announcement Operations
  async getAllAnnouncements(
    official?: boolean,
  ): Promise<GetAllAnnouncementsResponse> {
    return this.announcement.getAllAnnouncements({ official });
  }

  async createAnnouncement(
    dto: CreateAnnouncementRequestDto,
  ): Promise<CreateAnnouncementResponse> {
    return this.announcement.createAnnouncement(dto);
  }

  async deleteAnnouncementById(
    id: number,
  ): Promise<DeleteAnnouncementResponse> {
    return this.announcement.deleteAnnouncementById(id);
  }

  // Seva Operations
  async getAllSevas(): Promise<GetAllSevasResponse> {
    return this.seva.getAllSevas();
  }

  async createSeva(dto: CreateSevaRequestDto): Promise<CreateSevaResponse> {
    return this.seva.createSeva(dto);
  }

  async registerForSevaById(id: number): Promise<RegisterForSevaResponse> {
    return this.seva.registerForSevaById(id);
  }
}

// Global Singleton Instance
export const apiService = new ApiService();
