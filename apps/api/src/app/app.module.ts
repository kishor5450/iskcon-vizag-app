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
        type: 'sqlite',
        database: 'iskcon_vizag.sqlite',
        entities: [DevoteeEntity, SadhanaRecordEntity, AnnouncementEntity, SevaOpportunityEntity],
        synchronize: true, // Dev sync: auto-creates tables on start
      } as any),
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
export class AppModule { }

