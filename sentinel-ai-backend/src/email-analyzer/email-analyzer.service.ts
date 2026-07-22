import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailAnalyzerService {
  private readonly logger = new Logger(EmailAnalyzerService.name);

  constructor(private prisma: PrismaService) {}

  async analyze(userId: string, emailContent: string) {
    const scan = await this.prisma.emailScan.create({
      data: { userId, rawContent: emailContent, status: 'PROCESSING' },
    });

    try {
      const result = await this.runAnalysis(emailContent);

      const updated = await this.prisma.emailScan.update({
        where: { id: scan.id },
        data: {
          sender: result.sender,
          senderDomain: result.senderDomain,
          subject: result.subject,
          spfStatus: result.spfStatus,
          dkimStatus: result.dkimStatus,
          dmarcStatus: result.dmarcStatus,
          spoofScore: result.spoofScore,
          urgencyScore: result.urgencyScore,
          emotionScore: result.emotionScore,
          impersonationScore: result.impersonationScore,
          suspiciousLinksScore: result.suspiciousLinkScore,
          riskScore: result.riskScore,
          severity: result.severity,
          verdict: result.verdict,
          indicators: JSON.stringify(result.indicators),
          aiSummary: result.aiSummary,
          recommendations: JSON.stringify(result.recommendations),
          extractedLinks: JSON.stringify(result.extractedLinks),
          threats: JSON.stringify(result.threats),
          status: 'COMPLETED',
        },
      });

      await this.prisma.usage.upsert({
        where: { userId },
        create: { userId, totalScans: 1, emailsAnalyzed: 1, threatsBlocked: result.riskScore > 60 ? 1 : 0 },
        update: { totalScans: { increment: 1 }, emailsAnalyzed: { increment: 1 } },
      });
      await this.prisma.user.update({ where: { id: userId }, data: { lastScanAt: new Date() } });

      return this.formatResult(updated);
    } catch (err) {
      await this.prisma.emailScan.update({ where: { id: scan.id }, data: { status: 'FAILED' } });
      throw err;
    }
  }

  private async runAnalysis(content: string) {
    const lines = content.split('\n');
    const fromLine = lines.find((l) => l.toLowerCase().startsWith('from:')) || '';
    const subjectLine = lines.find((l) => l.toLowerCase().startsWith('subject:')) || '';
    const sender = fromLine.replace(/^from:\s*/i, '').trim();
    const subject = subjectLine.replace(/^subject:\s*/i, '').trim();
    const senderDomain = this.extractEmailDomain(sender);
    const lowerContent = content.toLowerCase();

    const urgencyWords = ['urgent', 'immediately', 'now', 'expire', 'suspend', 'within 24', 'act now', 'limited time'];
    const urgencyMatches = urgencyWords.filter((w) => lowerContent.includes(w));
    const urgencyScore = Math.min(100, urgencyMatches.length * 20);

    const fearWords = ['suspended', 'blocked', 'compromised', 'unauthorized', 'threat', 'locked', 'risk', 'danger'];
    const fearMatches = fearWords.filter((w) => lowerContent.includes(w));
    const emotionScore = Math.min(100, fearMatches.length * 18);

    const brands = ['paypal', 'amazon', 'google', 'microsoft', 'apple', 'facebook', 'netflix', 'bank of america', 'chase'];
    const impersonatedBrand = brands.find((b) => lowerContent.includes(b) && !senderDomain.includes(b.replace(' ', '')));
    const impersonationScore = impersonatedBrand ? 90 : 0;

    const urlPattern = /https?:\/\/[^\s]+/g;
    const extractedLinks = content.match(urlPattern) || [];
    const suspiciousLinkScore = extractedLinks.some((url) => {
      const d = this.extractUrlDomain(url);
      return brands.some((b) => url.toLowerCase().includes(b) && !d.endsWith(b.replace(' ', '') + '.com'));
    }) ? 75 : extractedLinks.length > 3 ? 30 : 0;

    const hasSpf = content.toLowerCase().includes('spf=pass');
    const hasDkim = content.toLowerCase().includes('dkim=pass');
    const spfStatus = hasSpf ? 'pass' : 'fail';
    const dkimStatus = hasDkim ? 'pass' : 'fail';
    const spoofScore = !hasSpf && !hasDkim ? 60 : !hasSpf || !hasDkim ? 30 : 0;

    const riskScore = Math.min(100, Math.round(
      (urgencyScore * 0.2) + (emotionScore * 0.2) + (impersonationScore * 0.3) + (suspiciousLinkScore * 0.15) + (spoofScore * 0.15)
    ));

    const severity = this.scoreToSeverity(riskScore);
    const verdict = impersonationScore > 0 ? 'PHISHING' : riskScore > 60 ? 'SUSPICIOUS' : 'SAFE';

    const indicators = {
      urgency: { score: urgencyScore, label: urgencyScore > 50 ? `Extreme urgency tactics: ${urgencyMatches.slice(0, 2).join(', ')}` : 'No urgency tactics detected' },
      fear: { score: emotionScore, label: emotionScore > 50 ? `Fear-based language: ${fearMatches.slice(0, 2).join(', ')}` : 'No fear tactics detected' },
      impersonation: { score: impersonationScore, label: impersonationScore > 0 ? `Impersonating ${impersonatedBrand} via ${senderDomain}` : 'No brand impersonation detected' },
      suspicious_links: { score: suspiciousLinkScore, label: suspiciousLinkScore > 0 ? `${extractedLinks.length} suspicious URL(s) detected` : 'No suspicious links found' },
    };

    const aiSummary = riskScore > 60
      ? `This email shows signs of a phishing attack (risk: ${riskScore}/100). ${impersonatedBrand ? `The sender domain "${senderDomain}" does not match the official ${impersonatedBrand} domain.` : ''} ${urgencyMatches.length > 0 ? `Urgency tactics detected: "${urgencyMatches[0]}".` : ''} Do not click any links.`
      : `This email from "${sender}" appears legitimate. No significant phishing indicators were detected.`;

    const recommendations = riskScore > 60
      ? ['Do not click any links in this email', impersonatedBrand ? `Verify your ${impersonatedBrand} account at the official website` : null, 'Report as phishing to your email provider', 'Block the sender', 'Enable spam filters'].filter(Boolean)
      : ['Always verify sender identity for sensitive requests', 'Enable email security scanning'];

    const threats = riskScore > 60
      ? ['Phishing attempt', impersonatedBrand ? `Brand impersonation: ${impersonatedBrand}` : null].filter(Boolean)
      : [];

    return { sender, senderDomain, subject, spfStatus, dkimStatus, dmarcStatus: 'none', spoofScore, urgencyScore, emotionScore, impersonationScore, suspiciousLinkScore, riskScore, severity, verdict, indicators, aiSummary, recommendations, extractedLinks, threats };
  }

  private extractEmailDomain(email: string): string {
    const match = email.match(/@([^>\s]+)/);
    return match ? match[1] : '';
  }

  private extractUrlDomain(url: string): string {
    try { return new URL(url).hostname; } catch { return ''; }
  }

  private scoreToSeverity(score: number): string {
    if (score <= 20) return 'SAFE';
    if (score <= 40) return 'LOW';
    if (score <= 60) return 'MEDIUM';
    if (score <= 80) return 'HIGH';
    return 'CRITICAL';
  }

  private formatResult(scan: any) {
    return {
      id: scan.id,
      riskScore: scan.riskScore,
      severity: scan.severity.toLowerCase(),
      from: scan.sender,
      subject: scan.subject,
      indicators: this.tryParse(scan.indicators, {}),
      aiSummary: scan.aiSummary,
      recommendations: this.tryParse(scan.recommendations, []),
      technicalDetails: {
        spfStatus: scan.spfStatus,
        dkimStatus: scan.dkimStatus,
        dmarcStatus: scan.dmarcStatus,
        senderDomain: scan.senderDomain,
        extractedLinks: this.tryParse(scan.extractedLinks, []),
      },
    };
  }

  private tryParse(value: string | null, fallback: any): any {
    if (!value) return fallback;
    try { return JSON.parse(value); } catch { return fallback; }
  }
}
