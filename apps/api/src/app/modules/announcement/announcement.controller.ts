import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import {
  CreateAnnouncementRequestDto,
  DeleteAnnouncementByIdRequest,
  GetAllAnnouncementsRequest,
  GetAllAnnouncementsResponse,
  CreateAnnouncementResponse,
  DeleteAnnouncementResponse,
} from '@temple/models';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { returnException } from '../../core/backend-utils';

@Controller('announcements')
@UseGuards(AuthGuard)
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post('/getAllAnnouncements')
  async getAllAnnouncements(
    @Body() req: GetAllAnnouncementsRequest,
  ): Promise<GetAllAnnouncementsResponse> {
    try {
      return await this.announcementService.getAllAnnouncements(req);
    } catch (error) {
      return returnException(GetAllAnnouncementsResponse, error);
    }
  }

  @Post('/createAnnouncement')
  async createAnnouncement(
    @Body() req: CreateAnnouncementRequestDto,
  ): Promise<CreateAnnouncementResponse> {
    try {
      return await this.announcementService.createAnnouncement(req);
    } catch (error) {
      return returnException(CreateAnnouncementResponse, error);
    }
  }

  @Post('/deleteAnnouncementById')
  async deleteAnnouncementById(
    @Body() req: DeleteAnnouncementByIdRequest,
  ): Promise<DeleteAnnouncementResponse> {
    try {
      return await this.announcementService.deleteAnnouncementById(req);
    } catch (error) {
      return returnException(DeleteAnnouncementResponse, error);
    }
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: any, @Request() req: any) {
    if (!file) {
      throw new BadRequestException(
        'No file uploaded or invalid file field name. The file must be sent in the "file" field.',
      );
    }
    const host = req.get('host');
    const protocol = req.protocol || 'http';
    const fileUrl = `${protocol}://${host}/uploads/${file.filename}`;
    return { url: fileUrl };
  }
}
