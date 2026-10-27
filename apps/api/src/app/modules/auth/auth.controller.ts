import { Controller, Post, Body, Get, UseGuards, Request, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDto, IDevotee, RegisterRequestDto, LoginRequestDto, UpdatePreferencesRequestDto } from '@temple/models';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @Post('register')
  async register(@Body() req: RegisterRequestDto): Promise<IDevotee> {
    try {
      return await this.authService.register(req);
    } catch (error) {
      throw error;
    }
  }

  @Post('/login')
  @Post('login')
  async login(@Body() req: LoginRequestDto): Promise<LoginResponseDto> {
    try {
      return await this.authService.login(req);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('/getProfile')
  @Post('profile')
  @Get('profile')
  async getProfile(@Request() req: any): Promise<IDevotee> {
    try {
      return await this.authService.getDevoteeById(req.user.sub);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('/updatePreferences')
  @Post('preferences')
  @Put('preferences')
  async updatePreferences(
    @Request() req: any,
    @Body() body: UpdatePreferencesRequestDto
  ): Promise<IDevotee> {
    try {
      return await this.authService.updatePreferences(req.user.sub, body);
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
  @Post('/updateAvatar')
  @Post('avatar')
  @Put('avatar')
  async updateAvatar(
    @Request() req: any,
    @Body() body: { avatarUrl: string }
  ): Promise<IDevotee> {
    try {
      return await this.authService.updateAvatar(req.user.sub, body);
    } catch (error) {
      throw error;
    }
  }
}
