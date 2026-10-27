import { Controller, Get, Post, Delete, Body, Query, Param, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
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

  @Post('/getAll')
  @Post('list')
  @Get()
  async getAllAnnouncements(
    @Query('official') queryOfficial?: string,
    @Body('official') bodyOfficial?: any
  ): Promise<IAnnouncement[]> {
    try {
      const raw = bodyOfficial !== undefined ? bodyOfficial : queryOfficial;
      const isOfficial = raw === undefined ? undefined : String(raw) === 'true';
      return await this.announcementService.getAllAnnouncements(isOfficial);
    } catch (error) {
      throw error;
    }
  }

  @Post('/create')
  @Post()
  async createAnnouncement(@Body() dto: CreateAnnouncementRequestDto): Promise<IAnnouncement> {
    try {
      return await this.announcementService.createAnnouncement(dto);
    } catch (error) {
      throw error;
    }
  }

  @Post('/delete')
  @Post(':id/delete')
  @Delete(':id')
  async deleteAnnouncement(@Param('id') id?: string, @Body('id') bodyId?: number): Promise<void> {
    try {
      const targetId = id ? Number(id) : Number(bodyId);
      return await this.announcementService.deleteAnnouncement(targetId);
    } catch (error) {
      throw error;
    }
  }

  @Post('/upload')
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
    if (!file) {
      throw new BadRequestException('No file uploaded or invalid file field name. The file must be sent in the "file" field.');
    }
    const host = req.get('host');
    const protocol = req.protocol || 'http';
    const fileUrl = `${protocol}://${host}/uploads/${file.filename}`;
    return { url: fileUrl };
  }
}
