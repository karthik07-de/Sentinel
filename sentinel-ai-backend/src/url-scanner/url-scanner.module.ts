import { Module } from '@nestjs/common';
import { UrlScannerController } from './url-scanner.controller';
import { UrlScannerService } from './url-scanner.service';

@Module({
  controllers: [UrlScannerController],
  providers: [UrlScannerService],
  exports: [UrlScannerService],
})
export class UrlScannerModule {}
