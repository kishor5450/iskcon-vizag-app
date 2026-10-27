export class SadhanaSummaryDto {
  japaRoundsChanted: number;
  japaGoal: number;
  readingBook: string;
  readingProgress: string;
  sadhanaCompletedCount: number;
  sadhanaTotalCount: number;

  constructor(
    japaRoundsChanted: number,
    japaGoal: number,
    readingBook: string,
    readingProgress: string,
    sadhanaCompletedCount: number,
    sadhanaTotalCount: number
  ) {
    this.japaRoundsChanted = japaRoundsChanted;
    this.japaGoal = japaGoal;
    this.readingBook = readingBook;
    this.readingProgress = readingProgress;
    this.sadhanaCompletedCount = sadhanaCompletedCount;
    this.sadhanaTotalCount = sadhanaTotalCount;
  }
}
