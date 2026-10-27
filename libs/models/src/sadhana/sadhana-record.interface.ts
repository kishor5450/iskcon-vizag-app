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
  nbsJoined: boolean;
  createdAt: string;
}
