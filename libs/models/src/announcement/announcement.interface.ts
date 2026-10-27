import { AnnouncementType } from '../enums';

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
