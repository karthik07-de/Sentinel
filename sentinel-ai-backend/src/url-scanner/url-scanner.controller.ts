import { Controller, Post, Get, Body, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsUrl, IsString } from 'class-validator';
import { UrlScannerService } from './url-scanner.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class AnalyzeUrlDto {
  @IsString()
  url: string;
}

@ApiTags('url-scanner')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('url-scanner')
export class UrlScannerController {
  constructor(private readonly urlScannerService: UrlScannerService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze a URL for threats' })
  analyze(@CurrentUser('id') userId: string, @Body() body: AnalyzeUrlDto) {
    return this.urlScannerService.analyze(userId, body.url);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get URL scan history' })
  getHistory(
    @CurrentUser('id') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.urlScannerService.getHistory(userId, page, limit);
  }
}
