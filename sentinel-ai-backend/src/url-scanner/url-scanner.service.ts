import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as dns from 'dns/promises';

@Injectable()
export class UrlScannerService {
  private readonly logger = new Logger(UrlScannerService.name);

  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async analyze(userId: string, url: string) {
    const scan = await this.prisma.uRLScan.create({
      data: { userId, url, status: 'PROCESSING' },
    });

    try {
      const result = await this.runAnalysis(url);

      const updated = await this.prisma.uRLScan.update({
        where: { id: scan.id },
        data: {
          domain: result.domain,
          ipAddress: result.ipAddress,
          riskScore: result.riskScore,
          severity: result.severity,
          verdict: result.verdict,
          sslStatus: result.sslStatus,
          threats: JSON.stringify(result.threats),
          indicators: JSON.stringify(result.indicators),
          aiExplanation: result.aiExplanation,
          recommendations: JSON.stringify(result.recommendations),
          malwareEngines: result.malwareEngines,
          totalEngines: result.totalEngines,
          status: 'COMPLETED',
        },
      });

      await this.prisma.usage.upsert({
        where: { userId },
        create: { userId, totalScans: 1, urlsScanned: 1, threatsBlocked: result.riskScore > 60 ? 1 : 0 },
        update: { totalScans: { increment: 1 }, urlsScanned: { increment: 1 } },
      });
      await this.prisma.user.update({ where: { id: userId }, data: { lastScanAt: new Date() } });

      return this.formatResult(updated);
    } catch (err) {
      await this.prisma.uRLScan.update({ where: { id: scan.id }, data: { status: 'FAILED' } });
      throw err;
    }
  }

  private async runAnalysis(url: string) {
    const domain = this.extractDomain(url);
    let ipAddress: string | undefined;
    let riskScore = 0;
    const threats: string[] = [];
    const indicators: string[] = [];

    // DNS lookup
    try {
      const addr = await dns.lookup(domain);
      ipAddress = addr.address;
    } catch {
      indicators.push('Domain does not resolve');
      riskScore += 20;
    }

    // VirusTotal
    const vt = await this.checkVirusTotal(url);
    if (vt) { riskScore += vt.riskContribution; threats.push(...vt.threats); indicators.push(...vt.indicators); }

    // Google Safe Browsing
    const gsb = await this.checkGoogleSafeBrowsing(url);
    if (gsb.isMalicious) { riskScore += 40; threats.push(...gsb.threats); }

    // Heuristics
    const h = this.runHeuristics(url, domain);
    riskScore += h.score;
    indicators.push(...h.indicators);
    threats.push(...h.threats);

    const sslStatus = url.startsWith('https://');
    if (!sslStatus) { indicators.push('No HTTPS'); riskScore += 10; }

    riskScore = Math.min(100, Math.max(0, riskScore));
    const severity = this.scoreToSeverity(riskScore);
    const verdict = this.toVerdict(severity, threats);
    const aiExplanation = this.explain(domain, riskScore, threats, indicators, sslStatus, vt);
    const recommendations = this.recommend(riskScore, threats);

    return { domain, ipAddress, riskScore, severity, verdict, sslStatus, threats, indicators, aiExplanation, recommendations, malwareEngines: vt?.malwareEngines, totalEngines: vt?.totalEngines };
  }

  private async checkVirusTotal(url: string) {
    const apiKey = this.config.get<string>('securityApis.virusTotalApiKey');
    if (!apiKey) return null;
    try {
      const encoded = Buffer.from(url).toString('base64').replace(/=/g, '');
      const res = await axios.get(`https://www.virustotal.com/api/v3/urls/${encoded}`, { headers: { 'x-apikey': apiKey }, timeout: 8000 });
      const stats = res.data?.data?.attributes?.last_analysis_stats || {};
      const malicious = (stats.malicious || 0) + (stats.suspicious || 0);
      const total = Object.values(stats).reduce((a: number, b: any) => a + b, 0) as number;
      return { riskContribution: total > 0 ? Math.round((malicious / total) * 60) : 0, threats: malicious > 0 ? [`Detected by ${malicious}/${total} engines`] : [], indicators: malicious > 0 ? [`VirusTotal: ${malicious} flags`] : [], malwareEngines: malicious, totalEngines: total };
    } catch { return null; }
  }

  private async checkGoogleSafeBrowsing(url: string) {
    const apiKey = this.config.get<string>('securityApis.googleSafeBrowsingApiKey');
    if (!apiKey) return { isMalicious: false, threats: [] };
    try {
      const res = await axios.post(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`, {
        client: { clientId: 'sentinel-ai', clientVersion: '1.0.0' },
        threatInfo: { threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'], platformTypes: ['ANY_PLATFORM'], threatEntryTypes: ['URL'], threatEntries: [{ url }] },
      }, { timeout: 5000 });
      const matches = res.data?.matches || [];
      return { isMalicious: matches.length > 0, threats: matches.map((m: any) => `GSB: ${m.threatType}`) };
    } catch { return { isMalicious: false, threats: [] }; }
  }

  private runHeuristics(url: string, domain: string) {
    let score = 0;
    const indicators: string[] = [];
    const threats: string[] = [];
    const lower = url.toLowerCase();

    if (['.xyz', '.tk', '.ml', '.ga', '.cf', '.top', '.click'].some((t) => domain.endsWith(t))) { score += 15; indicators.push(`Suspicious TLD: .${domain.split('.').pop()}`); }
    const brand = ['paypal', 'amazon', 'google', 'microsoft', 'apple', 'facebook', 'netflix'].find((b) => lower.includes(b) && !domain.includes(b + '.com'));
    if (brand) { score += 25; threats.push('Brand impersonation'); indicators.push(`"${brand}" in URL but not official domain`); }
    if (/[a-z][0-9][a-z]/i.test(domain)) { score += 15; indicators.push('Typosquatting pattern in domain'); }
    if (/login|signin|verify|secure|account|update|confirm/i.test(lower)) { score += 10; indicators.push('Phishing keyword in URL'); }
    if (/^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) { score += 30; threats.push('IP address as host'); }

    return { score, indicators, threats };
  }

  private extractDomain(url: string): string {
    try { return new URL(url).hostname; } catch { return url; }
  }

  private scoreToSeverity(score: number): string {
    if (score <= 20) return 'SAFE';
    if (score <= 40) return 'LOW';
    if (score <= 60) return 'MEDIUM';
    if (score <= 80) return 'HIGH';
    return 'CRITICAL';
  }

  private toVerdict(severity: string, threats: string[]): string {
    if (severity === 'SAFE' || severity === 'LOW') return 'SAFE';
    if (threats.some((t) => /phish|impersonat/i.test(t))) return 'PHISHING';
    if (threats.some((t) => /malware/i.test(t))) return 'MALWARE';
    if (threats.some((t) => /scam/i.test(t))) return 'SCAM';
    return 'SUSPICIOUS';
  }

  private explain(domain: string, score: number, threats: string[], indicators: string[], ssl: boolean, vt: any): string {
    if (score <= 20) return `"${domain}" appears safe. No threats detected. SSL: ${ssl ? 'valid' : 'missing'}.`;
    const vtInfo = vt?.malwareEngines > 0 ? ` VirusTotal: ${vt.malwareEngines}/${vt.totalEngines} flags.` : '';
    return `Risk score ${score}/100 for "${domain}".${vtInfo} ${indicators.slice(0, 2).join('. ')}. ${score > 60 ? 'Avoid this URL.' : 'Exercise caution.'}`;
  }

  private recommend(score: number, threats: string[]): string[] {
    const r: string[] = [];
    if (score > 60) { r.push('Do not visit or enter credentials on this site'); r.push('Report to your IT/security team'); }
    r.push('Verify the URL by checking the official website directly');
    r.push('Keep your browser updated with security protections enabled');
    return r.slice(0, 4);
  }

  private formatResult(scan: any) {
    const parse = (v: string | null, fb: any) => { try { return v ? JSON.parse(v) : fb; } catch { return fb; } };
    return {
      id: scan.id,
      type: 'url',
      input: scan.url,
      riskScore: scan.riskScore,
      severity: scan.severity.toLowerCase(),
      threatType: (scan.verdict || 'unknown').toLowerCase(),
      timestamp: scan.createdAt,
      details: {
        summary: scan.aiExplanation || '',
        indicators: parse(scan.indicators, []),
        aiExplanation: scan.aiExplanation || '',
        categories: parse(scan.threats, []),
      },
      recommendations: parse(scan.recommendations, []),
      technicalDetails: {
        ipAddress: scan.ipAddress,
        sslCertificate: scan.sslStatus,
        malwareDetections: scan.malwareEngines,
        totalEngines: scan.totalEngines,
      },
    };
  }

  async getHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.uRLScan.findMany({ where: { userId, deletedAt: null }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.uRLScan.count({ where: { userId, deletedAt: null } }),
    ]);
    return { items: items.map(this.formatResult.bind(this)), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
