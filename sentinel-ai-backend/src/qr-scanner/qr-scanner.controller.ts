import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { QrScannerService } from './qr-scanner.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { memoryStorage } from 'multer';

@ApiTags('qr-scanner')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('qr-scanner')
export class QrScannerController {
  constructor(private readonly qrScannerService: QrScannerService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Upload QR code image for analysis' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
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
    if (!file) throw new BadRequestException('QR code image is required');
    return this.qrScannerService.analyze(userId, file);
  }
}
