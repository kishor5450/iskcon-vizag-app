export class LoginRequestDto {
  email: string;
  passwordPlain: string;

  constructor(email: string, passwordPlain: string) {
    this.email = email;
    this.passwordPlain = passwordPlain;
  }
}
