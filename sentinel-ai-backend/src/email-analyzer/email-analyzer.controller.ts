import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { EmailAnalyzerService } from './email-analyzer.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class AnalyzeEmailDto {
  @IsString()
  @MinLength(10)
  emailContent: string;
}

@ApiTags('email-analyzer')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('email-analyzer')
export class EmailAnalyzerController {
  constructor(private readonly emailAnalyzerService: EmailAnalyzerService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze email content for phishing' })
  analyze(@CurrentUser('id') userId: string, @Body() body: AnalyzeEmailDto) {
    return this.emailAnalyzerService.analyze(userId, body.emailContent);
  }
}
