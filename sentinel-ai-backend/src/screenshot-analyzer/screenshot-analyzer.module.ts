import { Module } from '@nestjs/common';
import { ScreenshotAnalyzerController } from './screenshot-analyzer.controller';
import { ScreenshotAnalyzerService } from './screenshot-analyzer.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [ScreenshotAnalyzerController],
  providers: [ScreenshotAnalyzerService],
})
export class ScreenshotAnalyzerModule {}
