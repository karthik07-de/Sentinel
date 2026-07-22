// ============================================================
// Sentinel AI — Typed API Client
// All communication with the NestJS backend
// ============================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// ---- Token helpers (localStorage, safe for SSR) ----------

export const tokenStore = {
  getAccess: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("sentinel_access") : null,
  getRefresh: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("sentinel_refresh") : null,
  set: (access: string, refresh: string) => {
    localStorage.setItem("sentinel_access", access);
    localStorage.setItem("sentinel_refresh", refresh);
  },
  clear: () => {
    localStorage.removeItem("sentinel_access");
    localStorage.removeItem("sentinel_refresh");
  },
};

// ---- Core fetch wrapper ------------------------------------

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = tokenStore.getAccess();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // Token expired — try refresh once
  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return apiFetch<T>(path, options, false);
    tokenStore.clear();
    if (typeof window !== "undefined") window.location.href = "/auth/login";
    throw new Error("Session expired");
  }

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || `Request failed: ${res.status}`);
  }

  // Backend wraps in { success, data, ... }
  return (json.data !== undefined ? json.data : json) as T;
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    const data = json.data || json;
    tokenStore.set(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// ============================================================
// AUTH
// ============================================================

export interface AuthResponse {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  register: (name: string, email: string, password: string) =>
    apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: (refreshToken?: string) =>
    apiFetch<void>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  getProfile: () => apiFetch<UserProfile>("/auth/profile"),
};

// ============================================================
// DASHBOARD
// ============================================================

export const dashboardApi = {
  get: () => apiFetch<DashboardData>("/dashboard"),
  getScans: (params?: { page?: number; limit?: number; type?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.type && params.type !== "all") q.set("type", params.type);
    if (params?.search) q.set("search", params.search);
    return apiFetch<{ items: ScanHistory[]; meta: PaginationMeta }>(`/dashboard/scans?${q}`);
  },
};

// ============================================================
// SCANNERS
// ============================================================

export const urlScannerApi = {
  analyze: (url: string) =>
    apiFetch<ThreatResult>("/url-scanner/analyze", {
      method: "POST",
      body: JSON.stringify({ url }),
    }),
};

export const emailAnalyzerApi = {
  analyze: (emailContent: string) =>
    apiFetch<EmailScanResult>("/email-analyzer/analyze", {
      method: "POST",
      body: JSON.stringify({ emailContent }),
    }),
};

export const screenshotAnalyzerApi = {
  analyze: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return apiFetch<ScreenshotScanResult>("/screenshot-analyzer/analyze", {
      method: "POST",
      body: form,
    });
  },
};

export const qrScannerApi = {
  analyze: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return apiFetch<QRScanResult>("/qr-scanner/analyze", {
      method: "POST",
      body: form,
    });
  },
};

// ============================================================
// AI COPILOT
// ============================================================

export const copilotApi = {
  getConversations: () => apiFetch<Conversation[]>("/ai-copilot/conversations"),
  createConversation: () => apiFetch<Conversation>("/ai-copilot/conversations", { method: "POST" }),
  getMessages: (id: string) =>
    apiFetch<{ messages: BackendMessage[] }>(`/ai-copilot/conversations/${id}/messages`),
  sendMessage: (conversationId: string, content: string) =>
    apiFetch<BackendMessage>(`/ai-copilot/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
  deleteConversation: (id: string) =>
    apiFetch<void>(`/ai-copilot/conversations/${id}`, { method: "DELETE" }),
};

// ============================================================
// NOTIFICATIONS
// ============================================================

export const notificationsApi = {
  getAll: () => apiFetch<BackendNotification[]>("/notifications"),
  getUnreadCount: () => apiFetch<{ count: number }>("/notifications/unread-count"),
  markRead: (id: string) =>
    apiFetch<void>(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => apiFetch<void>("/notifications/read-all", { method: "PATCH" }),
};

// ============================================================
// REPORTS
// ============================================================

export const reportsApi = {
  getSummary: () => apiFetch<ReportSummary>("/reports/summary"),
  getChartData: () => apiFetch<ChartDataPoint[]>("/reports/chart-data"),
};

// ============================================================
// TYPES (matching both frontend types/index.ts and backend responses)
// ============================================================

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "premium" | "family";
  cyberScore: number;
  joinedAt: string;
  emailVerified: boolean;
  isMfaEnabled: boolean;
  stats: {
    totalScans: number;
    threatsBlocked: number;
    urlsScanned: number;
    emailsAnalyzed: number;
    imagesScanned: number;
    qrCodesScanned: number;
    streak: number;
    lastScan: string | null;
  };
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  locked: boolean;
  unlockedAt?: string | null;
}

export interface DashboardData {
  user: UserProfile;
  stats: UserProfile["stats"];
  recentScans: ScanHistory[];
  notifications: BackendNotification[];
  chartData: ChartDataPoint[];
  activityFeed: ActivityItem[];
  recommendations: string[];
}

export interface ScanHistory {
  id: string;
  type: "url" | "email" | "image" | "qr";
  input: string;
  riskScore: number;
  severity: "safe" | "low" | "medium" | "high" | "critical";
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

export interface ThreatResult {
  id: string;
  type: "url";
  input: string;
  riskScore: number;
  severity: string;
  threatType: string;
  timestamp: string;
  details: {
    summary: string;
    indicators: string[];
    aiExplanation: string;
    categories: string[];
  };
  recommendations: string[];
  technicalDetails: {
    ipAddress?: string;
    registrationDate?: string;
    serverLocation?: string;
    sslCertificate?: boolean;
    redirectChain?: string[];
    malwareDetections?: number;
    totalEngines?: number;
  };
}

export interface EmailScanResult {
  id: string;
  riskScore: number;
  severity: string;
  from: string;
  subject: string;
  indicators: Record<string, { score: number; label: string }>;
  aiSummary: string;
  recommendations: string[];
  technicalDetails: {
    spfStatus: string;
    dkimStatus: string;
    dmarcStatus: string;
    senderDomain: string;
    extractedLinks: string[];
  };
}

export interface ScreenshotScanResult {
  id: string;
  riskScore: number;
  severity: string;
  extractedText: string;
  threats: string[];
  summary: string;
  recommendations: string[];
}

export interface QRScanResult {
  id: string;
  riskScore: number;
  severity: string;
  decodedUrl: string;
  type: string;
  findings: string[];
  safe: boolean;
  summary: string;
  recommendations: string[];
}

export interface BackendMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendNotification {
  id: string;
  type: "threat" | "scan" | "tip" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity?: string;
}

export interface ChartDataPoint {
  date: string;
  threats: number;
  scans: number;
  safe: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  severity: string;
}

export interface ReportSummary {
  totalScans: number;
  threatsFound: number;
  safeScansPct: number;
  cyberScore: number;
  breakdown: { urls: number; emails: number; images: number; qr: number };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
