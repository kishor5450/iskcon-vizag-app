import { Controller, Post, Body, Get, UseGuards, Request, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DevoteeEntity } from '../../entities/devotee.entity';
import { ILoginResponse, IDevotee } from '@temple/models';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() devoteeDto: Partial<DevoteeEntity>): Promise<IDevotee> {
    return this.authService.register(devoteeDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; passwordPlain: string }): Promise<ILoginResponse> {
    return this.authService.login(body.email, body.passwordPlain);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<IDevotee> {
    return this.authService.getDevoteeById(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Put('preferences')
  async updatePreferences(
    @Request() req,
    @Body() body: { preferredLanguage: 'en' | 'te' | 'hi'; japaGoal: number }
  ): Promise<IDevotee> {
    return this.authService.updatePreferences(req.user.sub, body.preferredLanguage, body.japaGoal);
  }
}
