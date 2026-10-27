import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { DevoteeRepository } from '../../entities/repository';
import {
  IDevotee,
  LoginResponseDto,
  RegisterRequestDto,
  LoginRequestDto,
  UpdatePreferencesRequestDto,
  PreferredLanguage,
  DevoteeRole,
} from '@temple/models';

@Injectable()
export class AuthService {
  constructor(
    private readonly devoteeRepository: DevoteeRepository,
    private readonly jwtService: JwtService,
  ) {}

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async registerDevotee(dto: RegisterRequestDto): Promise<IDevotee> {
    const existing = await this.devoteeRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const devotee = this.devoteeRepository.createDevotee({
      name: dto.name,
      email: dto.email,
      password: this.hashPassword(dto.passwordPlain || ''),
      phone: dto.phone,
      japaGoal: 16,
      currentStreak: 0,
      bestStreak: 0,
      totalRoundsChanted: 0,
      preferredLanguage: dto.preferredLanguage || PreferredLanguage.ENGLISH,
      role: dto.email.toLowerCase().includes('admin')
        ? DevoteeRole.ADMIN
        : DevoteeRole.DEVOTEE,
    });

    const saved = await this.devoteeRepository.saveDevotee(devotee);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = saved;
    return result as IDevotee;
  }

  async loginDevotee(
    emailOrDto:
      | string
      | LoginRequestDto
      | { email: string; passwordPlain: string },
    maybePassword?: string,
  ): Promise<LoginResponseDto> {
    const email =
      typeof emailOrDto === 'string' ? emailOrDto : emailOrDto.email;
    const passwordPlain =
      typeof emailOrDto === 'string'
        ? maybePassword || ''
        : emailOrDto.passwordPlain;

    const devotee = await this.devoteeRepository.findByEmail(email);
    if (!devotee) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashed = this.hashPassword(passwordPlain);
    if (devotee.password !== hashed) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: devotee.id,
      email: devotee.email,
      role: devotee.role,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...devoteeData } = devotee;

    return {
      token,
      devotee: devoteeData as IDevotee,
    };
  }

  async getDevoteeProfile(id: number): Promise<IDevotee> {
    const devotee = await this.devoteeRepository.findById(id);
    if (!devotee) {
      throw new UnauthorizedException('Devotee not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = devotee;
    return result as IDevotee;
  }

  async updateDevoteePreferences(
    id: number,
    langOrDto: PreferredLanguage | UpdatePreferencesRequestDto,
    maybeJapaGoal?: number,
  ): Promise<IDevotee> {
    const lang =
      typeof langOrDto === 'object' ? langOrDto.preferredLanguage : langOrDto;
    const japaGoal =
      typeof langOrDto === 'object'
        ? langOrDto.japaGoal
        : (maybeJapaGoal ?? 16);
    await this.devoteeRepository.updatePreferences(id, lang, japaGoal);
    return this.getDevoteeProfile(id);
  }

  async getAllDevotees(): Promise<IDevotee[]> {
    const list = await this.devoteeRepository.getAllDevoteesWithRecords();
    return list.map(({ password, ...result }) => {
      const sortedRecords =
        result.sadhanaRecords?.sort((a, b) => b.date.localeCompare(a.date)) ||
        [];
      const latestRecord = sortedRecords[0] || null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { sadhanaRecords, ...devoteeData } = result;
      return {
        ...devoteeData,
        todayRecord: latestRecord,
      } as any;
    });
  }

  async updateDevoteeAvatar(
    id: number,
    avatarOrObj: string | { avatarUrl: string },
  ): Promise<IDevotee> {
    const avatarUrl =
      typeof avatarOrObj === 'object' ? avatarOrObj.avatarUrl : avatarOrObj;
    await this.devoteeRepository.updateAvatar(id, avatarUrl);
    return this.getDevoteeProfile(id);
  }
}
