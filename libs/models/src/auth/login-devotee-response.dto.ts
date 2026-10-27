import { GlobalResponseObject } from '../common';
import { LoginResponseDto } from './login-response.dto';

export class LoginDevoteeResponse extends GlobalResponseObject<LoginResponseDto> {
  constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Login successful', data?: LoginResponseDto) {
    super(status, errorCode, internalMessage, data);
  }
}
