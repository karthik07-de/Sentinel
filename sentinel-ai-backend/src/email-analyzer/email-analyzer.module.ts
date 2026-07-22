import { Module } from '@nestjs/common';
import { EmailAnalyzerController } from './email-analyzer.controller';
import { EmailAnalyzerService } from './email-analyzer.service';

@Module({
  controllers: [EmailAnalyzerController],
  providers: [EmailAnalyzerService],
  exports: [EmailAnalyzerService],
})
export class EmailAnalyzerModule {}
