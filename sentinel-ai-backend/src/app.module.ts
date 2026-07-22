import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UrlScannerModule } from './url-scanner/url-scanner.module';
import { EmailAnalyzerModule } from './email-analyzer/email-analyzer.module';
import { ScreenshotAnalyzerModule } from './screenshot-analyzer/screenshot-analyzer.module';
import { QrScannerModule } from './qr-scanner/qr-scanner.module';
import { AiCopilotModule } from './ai-copilot/ai-copilot.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { StorageModule } from './storage/storage.module';
import { WebsocketModule } from './websocket/websocket.module';
import { QueuesModule } from './queues/queues.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import aiConfig from './config/ai.config';
import securityApisConfig from './config/security-apis.config';
import storageConfig from './config/storage.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig, jwtConfig, redisConfig, aiConfig, securityApisConfig, storageConfig],
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    DashboardModule,
    UrlScannerModule,
    EmailAnalyzerModule,
    ScreenshotAnalyzerModule,
    QrScannerModule,
    AiCopilotModule,
    ReportsModule,
    NotificationsModule,
    AnalyticsModule,
    StorageModule,
    WebsocketModule,
    QueuesModule,
  ],
})
export class AppModule {}
