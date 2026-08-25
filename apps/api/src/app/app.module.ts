import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevoteeEntity, SadhanaRecordEntity, AnnouncementEntity, SevaOpportunityEntity } from './entities';
import { AuthModule } from './modules/auth/auth.module';
import { SadhanaModule } from './modules/sadhana/sadhana.module';
import { AnnouncementModule } from './modules/announcement/announcement.module';
import { SevaModule } from './modules/seva/seva.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'devotee'),
        password: configService.get<string>('DB_PASSWORD', 'devotee_password'),
        database: configService.get<string>('DB_DATABASE', 'iskcon_vizag_db'),
        entities: [DevoteeEntity, SadhanaRecordEntity, AnnouncementEntity, SevaOpportunityEntity],
        synchronize: true, // Dev sync: auto-creates tables on start
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    SadhanaModule,
    AnnouncementModule,
    SevaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

