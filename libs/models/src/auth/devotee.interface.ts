import { PreferredLanguage, DevoteeRole } from '../enums';

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
  avatarUrl?: string;
  createdAt: string;
}
