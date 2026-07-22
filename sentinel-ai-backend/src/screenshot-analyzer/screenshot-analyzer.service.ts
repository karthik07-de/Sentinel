import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import Tesseract from 'tesseract.js';

@Injectable()
export class ScreenshotAnalyzerService {
  private readonly logger = new Logger(ScreenshotAnalyzerService.name);

  constructor(private prisma: PrismaService, private storage: StorageService) {}

  async analyze(userId: string, file: Express.Multer.File) {
    const scan = await this.prisma.screenshotScan.create({
      data: { userId, imageName: file.originalname, imageMimeType: file.mimetype, imageSize: file.size, status: 'PROCESSING' },
    });

    try {
      let imageUrl: string | undefined;
      let imageKey: string | undefined;
      try {
        const uploaded = await this.storage.uploadFile(file.buffer, file.originalname, file.mimetype, 'screenshots');
        imageUrl = uploaded.url;
        imageKey = uploaded.key;
      } catch (e) {
        this.logger.warn(`Storage skipped: ${e.message}`);
      }

      const ocrText = await this.runOcr(file.buffer);
      const result = this.analyzeOcrText(ocrText);

      const updated = await this.prisma.screenshotScan.update({
        where: { id: scan.id },
        data: {
          imageUrl, imageKey, ocrText,
          detectedThreats: JSON.stringify(result.detectedThreats),
          extractedUrls: JSON.stringify(result.extractedUrls),
          riskScore: result.riskScore,
          severity: result.severity,
          verdict: result.verdict,
          analysis: result.analysis,
          aiSummary: result.aiSummary,
          recommendations: JSON.stringify(result.recommendations),
          hasFakeLogin: result.hasFakeLogin,
          hasBrandSpoof: result.hasBrandSpoof,
          status: 'COMPLETED',
        },
      });

      await this.prisma.usage.upsert({
        where: { userId },
        create: { userId, totalScans: 1, imagesTotal: 1 },
        update: { totalScans: { increment: 1 }, imagesTotal: { increment: 1 } },
      });
      await this.prisma.user.update({ where: { id: userId }, data: { lastScanAt: new Date() } });

      return { id: updated.id, riskScore: updated.riskScore, severity: updated.severity.toLowerCase(), extractedText: ocrText, threats: result.detectedThreats, summary: updated.aiSummary, recommendations: result.recommendations };
    } catch (err) {
      await this.prisma.screenshotScan.update({ where: { id: scan.id }, data: { status: 'FAILED' } });
      throw err;
    }
  }

  private async runOcr(buffer: Buffer): Promise<string> {
    try {
      const { data } = await Tesseract.recognize(buffer, 'eng', { logger: () => {} });
      return data.text || '';
    } catch (err) {
      this.logger.warn(`OCR failed: ${err.message}`);
      return '';
    }
  }

  private analyzeOcrText(text: string) {
    const lower = text.toLowerCase();
    const detectedThreats: string[] = [];
    let riskScore = 0;

    const patterns = [
      { re: /you (have been|are|were) (selected|chosen|winner)/i, label: 'Prize/lottery scam pattern', score: 30 },
      { re: /claim (your|the) (prize|reward|gift|money)/i, label: 'Reward claim scam', score: 25 },
      { re: /act (now|immediately|fast)/i, label: 'Artificial urgency pressure', score: 20 },
      { re: /\$[\d,]+\s*(gift card|prize|reward)/i, label: 'Fake monetary reward promise', score: 35 },
      { re: /enter (your|credit card|bank|password)/i, label: 'Credential harvesting attempt', score: 40 },
      { re: /verify (your|account|identity)/i, label: 'Fake verification request', score: 20 },
    ];

    for (const { re, label, score } of patterns) {
      if (re.test(text)) { detectedThreats.push(label); riskScore += score; }
    }

    const urls = text.match(/https?:\/\/[^\s]+/g) || [];
    const extractedUrls = urls;
    for (const url of urls) {
      if (['.xyz', '.tk', '.ml', '.top', '.click'].some((t) => url.includes(t))) {
        detectedThreats.push(`Suspicious URL: ${url.substring(0, 50)}`);
        riskScore += 25;
        break;
      }
    }

    if (/\d+\s*hours?/i.test(text) && lower.includes('expire')) { detectedThreats.push('Time-limited pressure tactic'); riskScore += 15; }

    riskScore = Math.min(100, riskScore);
    const severity = riskScore <= 20 ? 'SAFE' : riskScore <= 40 ? 'LOW' : riskScore <= 60 ? 'MEDIUM' : riskScore <= 80 ? 'HIGH' : 'CRITICAL';
    const verdict = riskScore > 60 ? 'SCAM' : riskScore > 30 ? 'SUSPICIOUS' : 'SAFE';

    const aiSummary = riskScore > 60
      ? `This image contains suspicious content (risk: ${riskScore}/100). Detected: ${detectedThreats.slice(0, 2).join(', ')}. Do not follow any instructions.`
      : riskScore > 20 ? `Some suspicious content detected (risk: ${riskScore}/100). Exercise caution.`
      : 'No significant threats detected. Content appears safe.';

    const recommendations = riskScore > 60
      ? ['Do not visit URLs shown in this image', 'Report as a scam', 'Do not provide personal information', 'Block the sender']
      : ['Verify promotions through official channels', 'Be skeptical of unsolicited offers'];

    return { detectedThreats, extractedUrls, riskScore, severity, verdict, analysis: detectedThreats.join('; ') || 'No threats detected', aiSummary, recommendations, hasFakeLogin: lower.includes('password') || lower.includes('sign in'), hasBrandSpoof: /paypal|amazon|google|microsoft|apple/i.test(text) };
  }
}
