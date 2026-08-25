import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { DevoteeEntity } from '../../entities/devotee.entity';
import { IDevotee, LoginResponseDto, RegisterRequestDto, PreferredLanguage, DevoteeRole } from '@temple/models';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(DevoteeEntity)
    private readonly devoteeRepository: Repository<DevoteeEntity>,
    private readonly jwtService: JwtService
  ) {}

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async register(dto: RegisterRequestDto): Promise<IDevotee> {
    const existing = await this.devoteeRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const devotee = this.devoteeRepository.create({
      name: dto.name,
      email: dto.email,
      password: this.hashPassword(dto.passwordPlain || ''),
      phone: dto.phone,
      japaGoal: 16,
      currentStreak: 0,
      bestStreak: 0,
      totalRoundsChanted: 0,
      preferredLanguage: dto.preferredLanguage || PreferredLanguage.ENGLISH,
      role: DevoteeRole.DEVOTEE,
    });

    const saved = await this.devoteeRepository.save(devotee);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = saved;
    return result as IDevotee;
  }

  async login(email: string, passwordPlain: string): Promise<LoginResponseDto> {
    const devotee = await this.devoteeRepository.findOne({ where: { email } });
    if (!devotee) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashed = this.hashPassword(passwordPlain);
    if (devotee.password !== hashed) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: devotee.id, email: devotee.email, role: devotee.role });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...devoteeData } = devotee;

    return {
      token,
      devotee: devoteeData as IDevotee,
    };
  }

  async getDevoteeById(id: number): Promise<IDevotee> {
    const devotee = await this.devoteeRepository.findOne({ where: { id } });
    if (!devotee) {
      throw new UnauthorizedException('Devotee not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = devotee;
    return result as IDevotee;
  }

  async updatePreferences(id: number, lang: PreferredLanguage, japaGoal: number): Promise<IDevotee> {
    await this.devoteeRepository.update(id, { preferredLanguage: lang, japaGoal });
    return this.getDevoteeById(id);
  }
}
