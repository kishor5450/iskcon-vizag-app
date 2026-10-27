export class SadhanaLogRequestDto {
  date: string; // YYYY-MM-DD
  japaRoundsCount: number;
  readingCompleted: boolean;
  readingProgress?: string;
  mangalaArati: boolean;
  morningPrayer: boolean;
  spiritualLecture: boolean;
  nbsJoined: boolean;

  constructor(
    date: string,
    japaRoundsCount: number,
    readingCompleted: boolean,
    readingProgress: string | undefined,
    mangalaArati: boolean,
    morningPrayer: boolean,
    spiritualLecture: boolean,
    nbsJoined: boolean
  ) {
    this.date = date;
    this.japaRoundsCount = japaRoundsCount;
    this.readingCompleted = readingCompleted;
    this.readingProgress = readingProgress;
    this.mangalaArati = mangalaArati;
    this.morningPrayer = morningPrayer;
    this.spiritualLecture = spiritualLecture;
    this.nbsJoined = nbsJoined;
  }
}
