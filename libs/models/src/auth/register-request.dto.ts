import { PreferredLanguage } from '../enums';

export class RegisterRequestDto {
  name: string;
  email: string;
  passwordPlain: string;
  phone?: string;
  preferredLanguage?: PreferredLanguage;
  avatarUrl?: string;

  constructor(
    name: string,
    email: string,
    passwordPlain: string,
    phone?: string,
    preferredLanguage?: PreferredLanguage,
    avatarUrl?: string
  ) {
    this.name = name;
    this.email = email;
    this.passwordPlain = passwordPlain;
    this.phone = phone;
    this.preferredLanguage = preferredLanguage;
    this.avatarUrl = avatarUrl;
  }
}
