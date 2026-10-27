import { AnnouncementType } from '../enums';

export class CreateAnnouncementRequestDto {
  title: string;
  description: string;
  image?: string;
  type: AnnouncementType;
  date: string;
  time?: string;
  location?: string;
  official: boolean;

  constructor(
    title: string,
    description: string,
    image: string | undefined,
    type: AnnouncementType,
    date: string,
    time: string | undefined,
    location: string | undefined,
    official: boolean
  ) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.type = type;
    this.date = date;
    this.time = time;
    this.location = location;
    this.official = official;
  }
}
