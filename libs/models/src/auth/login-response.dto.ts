import { IDevotee } from './devotee.interface';

export class LoginResponseDto {
  token: string;
  devotee: IDevotee;

  constructor(token: string, devotee: IDevotee) {
    this.token = token;
    this.devotee = devotee;
  }
}
