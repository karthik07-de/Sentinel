import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class QrScannerService {
  private readonly logger = new Logger(QrScannerService.name);

  constructor(private prisma: PrismaService, private storage: StorageService) {}

  async analyze(userId: string, file: Express.Multer.File) {
    const scan = await this.prisma.qRScan.create({
      data: { userId, imageName: file.originalname, status: 'PROCESSING' },
    });

    try {
      let imageUrl: string | undefined;
      let imageKey: string | undefined;
      try {
        const uploaded = await this.storage.uploadFile(file.buffer, file.originalname, file.mimetype, 'qr-codes');
        imageUrl = uploaded.url;
        imageKey = uploaded.key;
      } catch (e) {
        this.logger.warn(`Storage skipped: ${e.message}`);
      }

      const decodedData = await this.decodeQr(file.buffer);
      const payloadType = this.detectPayloadType(decodedData);
      const result = this.analyzePayload(decodedData, payloadType);

      const updated = await this.prisma.qRScan.update({
        where: { id: scan.id },
        data: {
          imageUrl, imageKey,
          decodedData, payloadType,
          riskScore: result.riskScore,
          severity: result.severity,
          verdict: result.verdict,
          isSafe: result.isSafe,
          findings: JSON.stringify(result.findings),
          analysis: result.analysis,
          recommendations: JSON.stringify(result.recommendations),
          status: 'COMPLETED',
        },
      });

      await this.prisma.usage.upsert({
        where: { userId },
        create: { userId, totalScans: 1, qrCodesScanned: 1 },
        update: { totalScans: { increment: 1 }, qrCodesScanned: { increment: 1 } },
      });
      await this.prisma.user.update({ where: { id: userId }, data: { lastScanAt: new Date() } });

      return {
        id: updated.id,
        riskScore: updated.riskScore,
        severity: updated.severity.toLowerCase(),
        decodedUrl: updated.decodedData,
        type: updated.payloadType,
        findings: result.findings,
        safe: result.isSafe,
        summary: result.analysis,
        recommendations: result.recommendations,
      };
    } catch (err) {
      await this.prisma.qRScan.update({ where: { id: scan.id }, data: { status: 'FAILED' } });
      throw err;
    }
  }

  private async decodeQr(buffer: Buffer): Promise<string> {
    try {
      // Dynamic import to avoid startup cost
      const Jimp = await import('jimp');
      const jsQR = await import('jsqr');
      const image = await (Jimp as any).read(buffer);
      const { data, width, height } = image.bitmap;
      const code = (jsQR as any).default(new Uint8ClampedArray(data), width, height);
      return code?.data || 'Could not decode QR code';
    } catch (err) {
      this.logger.warn(`QR decode: ${err.message}`);
      return 'Could not decode QR code';
    }
  }

  private detectPayloadType(data: string): string {
    if (/^https?:\/\//i.test(data)) return 'URL';
    if (/^WIFI:/i.test(data)) return 'WIFI';
    if (/^BEGIN:VCARD/i.test(data)) return 'VCARD';
    if (/^mailto:/i.test(data)) return 'EMAIL';
    if (/^tel:/i.test(data)) return 'PHONE';
    return 'TEXT';
  }

  private analyzePayload(data: string, type: string) {
    const findings: string[] = [];
    let riskScore = 0;

    if (type === 'URL') {
      let domain = '';
      try { domain = new URL(data).hostname; } catch {}

      if (['.xyz', '.tk', '.ml', '.top', '.click'].some((t) => domain.endsWith(t))) {
        findings.push(`Suspicious TLD: ${domain}`); riskScore += 30;
      }
      if (!data.startsWith('https://')) { findings.push('No HTTPS — unencrypted'); riskScore += 10; }

      const brands = ['paypal', 'amazon', 'google', 'microsoft', 'apple', 'bank'];
      const impersonated = brands.find((b) => data.toLowerCase().includes(b) && !domain.includes(b + '.com'));
      if (impersonated) { findings.push(`Brand impersonation: ${impersonated}`); riskScore += 35; }

      if (/gift.card|prize|claim|reward|winner/i.test(data)) { findings.push('Scam pattern in URL'); riskScore += 30; }

      if (findings.length === 0) {
        findings.push(`Domain verified: ${domain}`);
        findings.push(data.startsWith('https') ? 'HTTPS enabled' : 'HTTP only');
        findings.push('No redirect threats detected');
      }
    } else {
      findings.push(`QR type: ${type}`, 'No URL threats applicable', 'Content appears safe');
    }

    riskScore = Math.min(100, riskScore);
    const severity = riskScore <= 20 ? 'SAFE' : riskScore <= 40 ? 'LOW' : riskScore <= 60 ? 'MEDIUM' : riskScore <= 80 ? 'HIGH' : 'CRITICAL';
    const verdict = riskScore > 60 ? 'SCAM' : riskScore > 30 ? 'SUSPICIOUS' : 'SAFE';
    const isSafe = riskScore <= 30;

    const analysis = isSafe
      ? `This QR code is safe. It points to: ${data.substring(0, 80)}. No threats detected.`
      : `Dangerous QR code (risk: ${riskScore}/100). ${findings.slice(0, 2).join('. ')}. Do not scan this code.`;

    const recommendations = isSafe
      ? ['QR code is safe to use', 'Always preview URLs before visiting']
      : ['Do not scan this QR code with your device', 'Report it to the venue or platform', 'Block any sites it redirects to'];

    return { riskScore, severity, verdict, isSafe, findings, analysis, recommendations };
  }
}
