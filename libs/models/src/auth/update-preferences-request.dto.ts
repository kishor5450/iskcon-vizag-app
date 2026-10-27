import { PreferredLanguage } from '../enums';

export class UpdatePreferencesRequestDto {
  preferredLanguage: PreferredLanguage;
  japaGoal: number;

  constructor(preferredLanguage: PreferredLanguage, japaGoal: number) {
    this.preferredLanguage = preferredLanguage;
    this.japaGoal = japaGoal;
  }
}
