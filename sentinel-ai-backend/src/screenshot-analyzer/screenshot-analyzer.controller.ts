import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { ScreenshotAnalyzerService } from './screenshot-analyzer.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { memoryStorage } from 'multer';

@ApiTags('screenshot-analyzer')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('screenshot-analyzer')
export class ScreenshotAnalyzerController {
  constructor(private readonly screenshotAnalyzerService: ScreenshotAnalyzerService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Upload screenshot for OCR and threat analysis' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  analyze(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Image file is required');
    return this.screenshotAnalyzerService.analyze(userId, file);
  }
}
