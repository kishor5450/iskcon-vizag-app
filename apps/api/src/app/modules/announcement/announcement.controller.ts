import { Controller, Get, Post, Delete, Body, Query, Param, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { IAnnouncement, CreateAnnouncementRequestDto } from '@temple/models';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('announcements')
@UseGuards(AuthGuard)
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  async getAll(
    @Query('official') official?: string
  ): Promise<IAnnouncement[]> {
    const isOfficial = official === undefined ? undefined : official === 'true';
    return this.announcementService.getAll(isOfficial);
  }

  @Post()
  async create(@Body() dto: CreateAnnouncementRequestDto): Promise<IAnnouncement> {
    return this.announcementService.create(dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.announcementService.delete(Number(id));
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: any, @Request() req: any) {
    const host = req.get('host');
    const protocol = req.protocol || 'http';
    const fileUrl = `${protocol}://${host}/uploads/${file.filename}`;
    return { url: fileUrl };
  }
}
