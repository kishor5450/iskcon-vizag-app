import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import {
  IAnnouncement,
  CreateAnnouncementRequestDto,
  GlobalResponseObject,
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
  @Post('/getAll')
  @Post('list')
  async getAllAnnouncements(
    @Body() req: GetAllAnnouncementsRequest,
  ): Promise<GetAllAnnouncementsResponse> {
    try {
      return await this.announcementService.getAllAnnouncements(req);
    } catch (error) {
      return returnException(GetAllAnnouncementsResponse, error);
    }
  }

  // Legacy GET for mobile app compatibility
  @Get()
  async getAllAnnouncementsLegacy(
    @Query('official') queryOfficial?: string,
  ): Promise<IAnnouncement[]> {
    const isOfficial =
      queryOfficial === undefined
        ? undefined
        : String(queryOfficial) === 'true';
    const res = await this.announcementService.getAllAnnouncements({
      official: isOfficial,
    });
    return res.data || [];
  }

  @Post('/createAnnouncement')
  @Post('/create')
  @Post()
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
  @Post('/deleteAnnouncement')
  @Post('/delete')
  @Post(':id/delete')
  @Delete(':id')
  async deleteAnnouncementById(
    @Param('id') id?: string,
    @Body() req?: DeleteAnnouncementByIdRequest | { id?: number },
  ): Promise<DeleteAnnouncementResponse> {
    try {
      const targetId = id ? Number(id) : Number(req?.id);
      return await this.announcementService.deleteAnnouncementById({
        id: targetId,
      });
    } catch (error) {
      return returnException(DeleteAnnouncementResponse, error);
    }
  }

  @Post('/upload')
  @Post('upload')
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
