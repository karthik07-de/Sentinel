export type SeverityLevel = "safe" | "low" | "medium" | "high" | "critical";
export type ThreatType =
  | "phishing"
  | "malware"
  | "scam"
  | "spam"
  | "suspicious"
  | "safe";
export type ScanType = "url" | "email" | "image" | "qr";

export interface ThreatResult {
  id: string;
  type: ScanType;
  input: string;
  riskScore: number;
  severity: SeverityLevel;
  threatType: ThreatType;
  timestamp: Date;
  details: ThreatDetails;
  recommendations: string[];
  technicalDetails: TechnicalDetails;
}

export interface ThreatDetails {
  summary: string;
  indicators: string[];
  aiExplanation: string;
  categories: string[];
}

export interface TechnicalDetails {
  ipAddress?: string;
  registrationDate?: string;
  serverLocation?: string;
  sslCertificate?: boolean;
  redirectChain?: string[];
  malwareDetections?: number;
  totalEngines?: number;
  headers?: Record<string, string>;
}

export interface ScanHistory {
  id: string;
  type: ScanType;
  input: string;
  riskScore: number;
  severity: SeverityLevel;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "premium" | "family";
  cyberScore: number;
  joinedAt: Date;
  stats: UserStats;
  achievements: Achievement[];
}

export interface UserStats {
  totalScans: number;
  threatsBlocked: number;
  urlsScanned: number;
  emailsAnalyzed: number;
  imagesScanned: number;
  qrCodesScanned: number;
  streak: number;
  lastScan: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  locked: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: "month" | "year";
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
  cta: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface Notification {
  id: string;
  type: "threat" | "scan" | "tip" | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  severity?: SeverityLevel;
}

export interface SecurityTip {
  id: string;
  title: string;
  content: string;
  category: string;
  icon: string;
}

export interface ChartDataPoint {
  date: string;
  threats: number;
  scans: number;
  safe: number;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  badge?: string;
}
