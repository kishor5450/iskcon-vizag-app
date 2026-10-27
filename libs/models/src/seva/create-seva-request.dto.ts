export class CreateSevaRequestDto {
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  requiredDevoteesCount: number;
  official: boolean;

  constructor(
    title: string,
    description: string,
    date: string,
    time: string | undefined,
    location: string,
    requiredDevoteesCount: number,
    official: boolean
  ) {
    this.title = title;
    this.description = description;
    this.date = date;
    this.time = time;
    this.location = location;
    this.requiredDevoteesCount = requiredDevoteesCount;
    this.official = official;
  }
}
