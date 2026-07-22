import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(userId: string) {
    const [user, urlCount, emailCount, imageCount, qrCount, recentScans] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId }, include: { usage: true } }),
      this.prisma.uRLScan.count({ where: { userId, deletedAt: null } }),
      this.prisma.emailScan.count({ where: { userId, deletedAt: null } }),
      this.prisma.screenshotScan.count({ where: { userId, deletedAt: null } }),
      this.prisma.qRScan.count({ where: { userId, deletedAt: null } }),
      this.getRecentScans(userId),
    ]);

    const notifications = await this.prisma.notification.findMany({
      where: { userId, read: false, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const chartData = await this.getChartData(userId);
    const activityFeed = await this.getActivityFeed(userId);
    const recommendations = this.generateRecommendations(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: (user.plan || 'FREE').toLowerCase(),
        cyberScore: user.cyberScore,
        joinedAt: user.createdAt,
        stats: {
          totalScans: user.usage?.totalScans || 0,
          threatsBlocked: user.usage?.threatsBlocked || 0,
          urlsScanned: user.usage?.urlsScanned || 0,
          emailsAnalyzed: user.usage?.emailsAnalyzed || 0,
          imagesScanned: user.usage?.imagesTotal || 0,
          qrCodesScanned: user.usage?.qrCodesScanned || 0,
          streak: user.streak || 0,
          lastScan: user.lastScanAt,
        },
      },
      stats: {
        totalScans: user.usage?.totalScans || 0,
        threatsBlocked: user.usage?.threatsBlocked || 0,
        urlsScanned: urlCount,
        emailsAnalyzed: emailCount,
        imagesScanned: imageCount,
        qrCodesScanned: qrCount,
        streak: user.streak || 0,
        lastScan: user.lastScanAt,
      },
      recentScans,
      notifications,
      chartData,
      activityFeed,
      recommendations,
    };
  }

  private async getRecentScans(userId: string, limit = 8) {
    const [urls, emails, images, qrs] = await Promise.all([
      this.prisma.uRLScan.findMany({ where: { userId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: limit }),
      this.prisma.emailScan.findMany({ where: { userId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: limit }),
      this.prisma.screenshotScan.findMany({ where: { userId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: limit }),
      this.prisma.qRScan.findMany({ where: { userId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: limit }),
    ]);

    const combined = [
      ...urls.map((s) => ({ id: s.id, type: 'url', input: s.url, riskScore: s.riskScore, severity: s.severity.toLowerCase(), timestamp: s.createdAt, status: s.status.toLowerCase() })),
      ...emails.map((s) => ({ id: s.id, type: 'email', input: s.sender || 'Unknown', riskScore: s.riskScore, severity: s.severity.toLowerCase(), timestamp: s.createdAt, status: s.status.toLowerCase() })),
      ...images.map((s) => ({ id: s.id, type: 'image', input: s.imageName || 'screenshot.png', riskScore: s.riskScore, severity: s.severity.toLowerCase(), timestamp: s.createdAt, status: s.status.toLowerCase() })),
      ...qrs.map((s) => ({ id: s.id, type: 'qr', input: s.imageName || 'qr_code.png', riskScore: s.riskScore, severity: s.severity.toLowerCase(), timestamp: s.createdAt, status: s.status.toLowerCase() })),
    ];

    return combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
  }

  private async getChartData(userId: string) {
    const data = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const [scans, threats] = await Promise.all([
        this.prisma.uRLScan.count({ where: { userId, createdAt: { gte: weekStart, lt: weekEnd } } }),
        this.prisma.uRLScan.count({ where: { userId, createdAt: { gte: weekStart, lt: weekEnd }, severity: { in: ['HIGH', 'CRITICAL', 'MEDIUM'] } } }),
      ]);
      data.push({ date: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), scans, threats, safe: Math.max(0, scans - threats) });
    }
    return data;
  }

  private async getActivityFeed(userId: string) {
    const logs = await this.prisma.auditLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 10 });
    return logs.map((l) => ({
      id: l.id,
      type: l.action.toLowerCase(),
      message: this.actionToMessage(l.action, l.metadata),
      timestamp: l.createdAt,
      severity: l.success ? 'safe' : 'high',
    }));
  }

  private actionToMessage(action: string, metadata: any): string {
    const meta = typeof metadata === 'string' ? JSON.parse(metadata || '{}') : (metadata || {});
    const map: Record<string, string> = {
      SCAN_URL: `URL scan: ${meta.url || 'URL'}`,
      SCAN_EMAIL: `Email analyzed: ${meta.sender || 'email'}`,
      SCAN_IMAGE: `Image scanned`,
      SCAN_QR: `QR code analyzed`,
      LOGIN: 'Logged in',
      LOGOUT: 'Logged out',
      REGISTER: 'Account created',
      PASSWORD_CHANGE: 'Password updated',
      MFA_ENABLE: '2FA enabled',
    };
    return map[action] || action.toLowerCase().replace('_', ' ');
  }

  private generateRecommendations(user: any): string[] {
    const recs: string[] = [];
    if (!user?.isMfaEnabled) recs.push('Enable two-factor authentication to secure your account');
    if ((user?.cyberScore || 50) < 60) recs.push('Your cyber score is low — run more scans to improve it');
    if ((user?.streak || 0) < 7) recs.push('Scan daily to build your security streak');
    recs.push('Use a password manager to maintain unique passwords');
    recs.push('Scan all URLs from emails before clicking');
    return recs.slice(0, 5);
  }

  async getAllScans(userId: string, page = 1, limit = 20, type?: string, search?: string) {
    const skip = (page - 1) * limit;
    const [urls, emails, images, qrs] = await Promise.all([
      (!type || type === 'url') ? this.prisma.uRLScan.findMany({ where: { userId, deletedAt: null, ...(search ? { url: { contains: search } } : {}) }, orderBy: { createdAt: 'desc' } }) : [],
      (!type || type === 'email') ? this.prisma.emailScan.findMany({ where: { userId, deletedAt: null, ...(search ? { sender: { contains: search } } : {}) }, orderBy: { createdAt: 'desc' } }) : [],
      (!type || type === 'image') ? this.prisma.screenshotScan.findMany({ where: { userId, deletedAt: null, ...(search ? { imageName: { contains: search } } : {}) }, orderBy: { createdAt: 'desc' } }) : [],
      (!type || type === 'qr') ? this.prisma.qRScan.findMany({ where: { userId, deletedAt: null, ...(search ? { imageName: { contains: search } } : {}) }, orderBy: { createdAt: 'desc' } }) : [],
    ]);

    const combined = [
      ...(urls as any[]).map((s) => ({ id: s.id, type: 'url', input: s.url, riskScore: s.riskScore, severity: s.severity.toLowerCase(), timestamp: s.createdAt, status: s.status.toLowerCase() })),
      ...(emails as any[]).map((s) => ({ id: s.id, type: 'email', input: s.sender || 'Unknown', riskScore: s.riskScore, severity: s.severity.toLowerCase(), timestamp: s.createdAt, status: s.status.toLowerCase() })),
      ...(images as any[]).map((s) => ({ id: s.id, type: 'image', input: s.imageName || 'screenshot.png', riskScore: s.riskScore, severity: s.severity.toLowerCase(), timestamp: s.createdAt, status: s.status.toLowerCase() })),
      ...(qrs as any[]).map((s) => ({ id: s.id, type: 'qr', input: s.imageName || 'qr_code.png', riskScore: s.riskScore, severity: s.severity.toLowerCase(), timestamp: s.createdAt, status: s.status.toLowerCase() })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const total = combined.length;
    return {
      items: combined.slice(skip, skip + limit),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: skip + limit < total, hasPrevPage: page > 1 },
    };
  }
}
