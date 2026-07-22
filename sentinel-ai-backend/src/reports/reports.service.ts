import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subWeeks } from 'date-fns';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getSummary(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { usage: true },
    });

    const [urlScans, emailScans, imageScans, qrScans] = await Promise.all([
      this.prisma.uRLScan.count({ where: { userId, deletedAt: null } }),
      this.prisma.emailScan.count({ where: { userId, deletedAt: null } }),
      this.prisma.screenshotScan.count({ where: { userId, deletedAt: null } }),
      this.prisma.qRScan.count({ where: { userId, deletedAt: null } }),
    ]);

    const totalScans = urlScans + emailScans + imageScans + qrScans;

    const threats = await this.prisma.uRLScan.count({
      where: { userId, deletedAt: null, severity: { in: ['HIGH', 'CRITICAL'] } as any },
    });

    const safePct = totalScans > 0
      ? Math.round(((totalScans - threats) / totalScans) * 100)
      : 100;

    return {
      totalScans,
      threatsFound: threats,
      safeScansPct: safePct,
      cyberScore: user?.cyberScore || 50,
      breakdown: {
        urls: urlScans,
        emails: emailScans,
        images: imageScans,
        qr: qrScans,
      },
    };
  }

  async getChartData(userId: string) {
    const weeks = 12;
    const data = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = subWeeks(new Date(), i + 1);
      const weekEnd = subWeeks(new Date(), i);
      const [scans, threats] = await Promise.all([
        this.prisma.uRLScan.count({ where: { userId, createdAt: { gte: weekStart, lt: weekEnd } } }),
        this.prisma.uRLScan.count({ where: { userId, createdAt: { gte: weekStart, lt: weekEnd }, severity: { in: ['HIGH', 'CRITICAL', 'MEDIUM'] as any } } }),
      ]);
      data.push({
        date: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        scans,
        threats,
        safe: Math.max(0, scans - threats),
      });
    }
    return data;
  }
}
