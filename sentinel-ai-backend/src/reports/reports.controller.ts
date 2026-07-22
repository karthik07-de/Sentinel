import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('reports')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get security report summary' })
  getSummary(@CurrentUser('id') userId: string) {
    return this.reportsService.getSummary(userId);
  }

  @Get('chart-data')
  @ApiOperation({ summary: 'Get 12-week threat chart data' })
  getChartData(@CurrentUser('id') userId: string) {
    return this.reportsService.getChartData(userId);
  }
}
