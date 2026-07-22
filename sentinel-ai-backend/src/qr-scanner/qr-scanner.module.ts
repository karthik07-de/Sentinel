import { Module } from '@nestjs/common';
import { QrScannerController } from './qr-scanner.controller';
import { QrScannerService } from './qr-scanner.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [QrScannerController],
  providers: [QrScannerService],
})
export class QrScannerModule {}
