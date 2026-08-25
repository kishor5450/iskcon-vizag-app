export interface IDevotee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  japaGoal: number;
  currentStreak: number;
  bestStreak: number;
  totalRoundsChanted: number;
  preferredLanguage: 'en' | 'te' | 'hi';
  role: 'devotee' | 'admin';
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
  type: 'festival' | 'temple' | 'classes' | 'seva' | 'general';
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

