export enum PreferredLanguage {
  ENGLISH = 'en',
  TELUGU = 'te',
  HINDI = 'hi',
}

export enum DevoteeRole {
  DEVOTEE = 'devotee',
  ADMIN = 'admin',
}

export enum AnnouncementType {
  FESTIVAL = 'festival',
  TEMPLE = 'temple',
  CLASSES = 'classes',
  SEVA = 'seva',
  GENERAL = 'general',
}

export interface IDevotee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  japaGoal: number;
  currentStreak: number;
  bestStreak: number;
  totalRoundsChanted: number;
  preferredLanguage: PreferredLanguage;
  role: DevoteeRole;
  createdAt: string;
}

export interface ISadhanaRecord {
  id: number;
  devoteeId: number;
  date: string; // YYYY-MM-DD format
  japaRoundsCount: number;
  readingCompleted: boolean;
  readingProgress: string;
  mangalaArati: boolean;
  morningPrayer: boolean;
  spiritualLecture: boolean;
  createdAt: string;
}

export interface IAnnouncement {
  id: number;
  title: string;
  description: string;
  image?: string;
  type: AnnouncementType;
  date: string;
  time?: string;
  location?: string;
  official: boolean; // true = Official ISKCON Vizag, false = Community/Devotee
  createdAt: string;
}

export interface ISevaOpportunity {
  id: number;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  requiredDevoteesCount: number;
  registeredDevoteesCount: number;
  official: boolean;
  createdAt: string;
}

export interface ILoginResponse {
  token: string;
  devotee: IDevotee;
}

export interface ISadhanaSummary {
  japaRoundsChanted: number;
  japaGoal: number;
  readingBook: string;
  readingProgress: string;
  sadhanaCompletedCount: number;
  sadhanaTotalCount: number;
}

// Request and Response DTOs
export interface IRegisterRequest {
  name: string;
  email: string;
  passwordPlain: string;
  phone?: string;
  preferredLanguage?: PreferredLanguage;
}

export interface ILoginRequest {
  email: string;
  passwordPlain: string;
}

export interface IUpdatePreferencesRequest {
  preferredLanguage: PreferredLanguage;
  japaGoal: number;
}

export interface ISadhanaLogRequest {
  date: string; // YYYY-MM-DD
  japaRoundsCount: number;
  readingCompleted: boolean;
  readingProgress?: string;
  mangalaArati: boolean;
  morningPrayer: boolean;
  spiritualLecture: boolean;
}

export interface ICreateAnnouncementRequest {
  title: string;
  description: string;
  image?: string;
  type: AnnouncementType;
  date: string;
  time?: string;
  location?: string;
  official: boolean;
}

export interface ICreateSevaRequest {
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  requiredDevoteesCount: number;
  official: boolean;
}


