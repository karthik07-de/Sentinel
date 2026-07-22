import { registerAs } from '@nestjs/config';

export default registerAs('securityApis', () => ({
  virusTotalApiKey: process.env.VIRUSTOTAL_API_KEY || '',
  googleSafeBrowsingApiKey: process.env.GOOGLE_SAFE_BROWSING_API_KEY || '',
  urlScanApiKey: process.env.URLSCAN_API_KEY || '',
  whoisApiKey: process.env.WHOIS_API_KEY || '',
  abuseIpDbApiKey: process.env.ABUSEIPDB_API_KEY || '',
}));
