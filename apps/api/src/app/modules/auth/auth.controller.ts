import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginResponseDto,
  IDevotee,
  RegisterRequestDto,
  LoginRequestDto,
  UpdatePreferencesRequestDto,
} from '@temple/models';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registerDevotee')
  @Post('/register')
  @Post('register')
  async registerDevotee(@Body() req: RegisterRequestDto): Promise<IDevotee> {
    try {
      return await this.authService.registerDevotee(req);
    } catch (error) {
      throw error;
    }
  }

  @Post('/loginDevotee')
  @Post('/login')
  @Post('login')
  async loginDevotee(@Body() req: LoginRequestDto): Promise<LoginResponseDto> {
    try {
      return await this.authService.loginDevotee(req);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('/getDevoteeProfile')
  @Post('/getProfile')
  @Post('profile')
  @Get('profile')
  async getDevoteeProfile(@Request() req: any): Promise<IDevotee> {
    try {
      return await this.authService.getDevoteeProfile(req.user.sub);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('/updateDevoteePreferences')
  @Post('/updatePreferences')
  @Post('preferences')
  @Put('preferences')
  async updateDevoteePreferences(
    @Request() req: any,
    @Body() body: UpdatePreferencesRequestDto,
  ): Promise<IDevotee> {
    try {
      return await this.authService.updateDevoteePreferences(
        req.user.sub,
        body,
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('/getAllDevotees')
  @Post('devotees')
  @Get('devotees')
  async getAllDevotees(): Promise<IDevotee[]> {
    try {
      return await this.authService.getAllDevotees();
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('/updateDevoteeAvatar')
  @Post('/updateAvatar')
  @Post('avatar')
  @Put('avatar')
  async updateDevoteeAvatar(
    @Request() req: any,
    @Body() body: { avatarUrl: string },
  ): Promise<IDevotee> {
    try {
      return await this.authService.updateDevoteeAvatar(req.user.sub, body);
    } catch (error) {
      throw error;
    }
  }
}
