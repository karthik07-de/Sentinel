import type {
  ScanHistory,
  ChatMessage,
  ChatSession,
  UserProfile,
  PricingPlan,
  Testimonial,
  Notification,
  SecurityTip,
  ChartDataPoint,
  Feature,
  Achievement,
  ThreatResult,
} from "@/types";

export const MOCK_USER: UserProfile = {
  id: "usr_01",
  name: "Alex Morgan",
  email: "alex@example.com",
  avatar: "https://avatars.githubusercontent.com/u/1234567",
  plan: "premium",
  cyberScore: 87,
  joinedAt: new Date("2024-01-15"),
  stats: {
    totalScans: 347,
    threatsBlocked: 23,
    urlsScanned: 189,
    emailsAnalyzed: 104,
    imagesScanned: 42,
    qrCodesScanned: 12,
    streak: 14,
    lastScan: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  achievements: [
    {
      id: "ach_01",
      title: "First Scan",
      description: "Completed your first scan",
      icon: "shield",
      unlockedAt: new Date("2024-01-15"),
      locked: false,
    },
    {
      id: "ach_02",
      title: "Threat Hunter",
      description: "Detected 10 threats",
      icon: "crosshair",
      unlockedAt: new Date("2024-02-10"),
      locked: false,
    },
    {
      id: "ach_03",
      title: "Cyber Guardian",
      description: "100 scans completed",
      icon: "award",
      unlockedAt: new Date("2024-03-05"),
      locked: false,
    },
    {
      id: "ach_04",
      title: "Streak Master",
      description: "7-day streak",
      icon: "zap",
      unlockedAt: new Date("2024-04-12"),
      locked: false,
    },
    {
      id: "ach_05",
      title: "Elite Sentinel",
      description: "500 scans completed",
      icon: "star",
      locked: true,
    },
    {
      id: "ach_06",
      title: "Paranoid Mode",
      description: "Block 50 threats",
      icon: "lock",
      locked: true,
    },
  ] as Achievement[],
};

export const MOCK_SCAN_HISTORY: ScanHistory[] = [
  {
    id: "scan_01",
    type: "url",
    input: "https://paypal-secure-login.xyz/account",
    riskScore: 94,
    severity: "critical",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: "completed",
  },
  {
    id: "scan_02",
    type: "email",
    input: "alert@bankofamerica-support.net",
    riskScore: 78,
    severity: "high",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "scan_03",
    type: "url",
    input: "https://github.com/microsoft/vscode",
    riskScore: 5,
    severity: "safe",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "scan_04",
    type: "image",
    input: "invoice_2024.png",
    riskScore: 42,
    severity: "medium",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "scan_05",
    type: "qr",
    input: "qr_code_scan.jpg",
    riskScore: 8,
    severity: "safe",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "scan_06",
    type: "url",
    input: "https://crypto-rewards-2024.io/claim",
    riskScore: 91,
    severity: "critical",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "scan_07",
    type: "email",
    input: "noreply@amazon.com",
    riskScore: 12,
    severity: "safe",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "scan_08",
    type: "url",
    input: "https://docs.google.com/spreadsheets",
    riskScore: 7,
    severity: "safe",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    status: "completed",
  },
];

export const MOCK_THREAT_RESULT: ThreatResult = {
  id: "threat_demo",
  type: "url",
  input: "https://paypal-secure-verify.xyz/login",
  riskScore: 91,
  severity: "critical",
  threatType: "phishing",
  timestamp: new Date(),
  details: {
    summary:
      "This URL is a phishing site impersonating PayPal. It attempts to steal login credentials.",
    indicators: [
      "Domain registered 2 days ago",
      "Not the official PayPal domain",
      "SSL certificate mismatch",
      "Suspicious redirect chain",
      "Detected by 18/67 antivirus engines",
    ],
    aiExplanation:
      "Our AI model detected multiple phishing patterns. The domain 'paypal-secure-verify.xyz' is crafted to mimic PayPal's official site while harvesting credentials. The URL uses common social engineering tactics including urgency keywords and a fake security verification flow.",
    categories: ["Phishing", "Credential Harvesting", "Brand Impersonation"],
  },
  recommendations: [
    "Do not enter any credentials on this site",
    "Report this site to your IT security team",
    "Clear your browser cache and cookies",
    "Check your PayPal account for unauthorized activity",
    "Enable two-factor authentication on your real PayPal account",
  ],
  technicalDetails: {
    ipAddress: "185.220.101.47",
    registrationDate: "2024-01-08",
    serverLocation: "Amsterdam, Netherlands",
    sslCertificate: false,
    redirectChain: [
      "https://paypal-secure-verify.xyz/login",
      "https://185.220.101.47/phish/paypal",
    ],
    malwareDetections: 18,
    totalEngines: 67,
  },
};

export const MOCK_CHAT_SESSIONS: ChatSession[] = [
  {
    id: "sess_01",
    title: "Phishing email analysis",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    messages: [],
  },
  {
    id: "sess_02",
    title: "URL scanner results",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    messages: [],
  },
  {
    id: "sess_03",
    title: "How to improve cyber score",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    messages: [],
  },
];

export const MOCK_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg_01",
    role: "assistant",
    content:
      "Hello! I'm your **Sentinel AI Copilot**. I can help you:\n\n- 🔍 Analyze suspicious URLs, emails, or files\n- 🛡️ Understand threat reports and risk scores\n- 💡 Provide cybersecurity tips and best practices\n- 📊 Interpret your security dashboard\n\nHow can I protect you today?",
    timestamp: new Date(),
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_01",
    type: "threat",
    title: "Critical Threat Detected",
    message: "Phishing site blocked: paypal-secure-verify.xyz",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    severity: "critical",
  },
  {
    id: "notif_02",
    type: "scan",
    title: "Scan Complete",
    message: "Your URL scan returned Risk Score: 5/100",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    severity: "safe",
  },
  {
    id: "notif_03",
    type: "tip",
    title: "Security Tip",
    message: "Enable 2FA on all your accounts for maximum protection",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "notif_04",
    type: "system",
    title: "Weekly Report Ready",
    message: "Your cybersecurity report for this week is available",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

export const MOCK_SECURITY_TIPS: SecurityTip[] = [
  {
    id: "tip_01",
    title: "Enable Two-Factor Authentication",
    content:
      "2FA adds an extra layer of security. Even if your password is compromised, attackers can't access your account.",
    category: "Account Security",
    icon: "shield-check",
  },
  {
    id: "tip_02",
    title: "Use a Password Manager",
    content:
      "Create unique, complex passwords for every account without memorizing them all.",
    category: "Passwords",
    icon: "key",
  },
  {
    id: "tip_03",
    title: "Verify Links Before Clicking",
    content:
      "Hover over links to see the real destination. Use Sentinel AI to scan suspicious URLs.",
    category: "Phishing",
    icon: "link",
  },
  {
    id: "tip_04",
    title: "Keep Software Updated",
    content:
      "Security patches fix vulnerabilities. Enable automatic updates on all devices.",
    category: "Device Security",
    icon: "refresh-cw",
  },
];

export const MOCK_CHART_DATA: ChartDataPoint[] = [
  { date: "Jan 1", threats: 12, scans: 45, safe: 33 },
  { date: "Jan 7", threats: 8, scans: 52, safe: 44 },
  { date: "Jan 14", threats: 15, scans: 61, safe: 46 },
  { date: "Jan 21", threats: 6, scans: 48, safe: 42 },
  { date: "Jan 28", threats: 19, scans: 73, safe: 54 },
  { date: "Feb 4", threats: 11, scans: 58, safe: 47 },
  { date: "Feb 11", threats: 23, scans: 89, safe: 66 },
  { date: "Feb 18", threats: 9, scans: 64, safe: 55 },
  { date: "Feb 25", threats: 14, scans: 71, safe: 57 },
  { date: "Mar 4", threats: 18, scans: 83, safe: 65 },
  { date: "Mar 11", threats: 7, scans: 56, safe: 49 },
  { date: "Mar 18", threats: 21, scans: 95, safe: 74 },
];

export const MOCK_STAT_CARDS = [
  {
    id: "stat_01",
    label: "Threats Detected",
    value: 2847391,
    change: "+12.5%",
    changeType: "danger" as const,
    icon: "shield-alert",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  {
    id: "stat_02",
    label: "Protected Users",
    value: 1200000,
    change: "+8.2%",
    changeType: "success" as const,
    icon: "users",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    id: "stat_03",
    label: "URLs Scanned",
    value: 98400000,
    change: "+23.1%",
    changeType: "success" as const,
    icon: "link",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    id: "stat_04",
    label: "Emails Analyzed",
    value: 45600000,
    change: "+15.7%",
    changeType: "success" as const,
    icon: "mail",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
];

export const MOCK_FEATURES: Feature[] = [
  {
    id: "feat_01",
    title: "AI URL Scanner",
    description:
      "Paste any URL and our AI analyzes it against 70+ threat intelligence feeds in real-time.",
    icon: "globe",
    color: "from-blue-500 to-cyan-500",
    badge: "Most Used",
  },
  {
    id: "feat_02",
    title: "Email Scanner",
    description:
      "Detect phishing attempts, impersonation attacks, and malicious links hidden in emails.",
    icon: "mail",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "feat_03",
    title: "Screenshot Scanner",
    description:
      "Upload screenshots and our OCR engine extracts text to identify scam patterns.",
    icon: "image",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "feat_04",
    title: "QR Code Scanner",
    description:
      "Decode and analyze QR codes before you scan them with your device.",
    icon: "qr-code",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "feat_05",
    title: "Threat Intelligence",
    description:
      "Real-time access to global threat databases, CVE feeds, and dark web monitoring.",
    icon: "brain",
    color: "from-red-500 to-rose-500",
    badge: "New",
  },
  {
    id: "feat_06",
    title: "Cyber Health Score",
    description:
      "Your personal cybersecurity rating that improves as you practice safer habits.",
    icon: "activity",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "feat_07",
    title: "Threat History",
    description:
      "Full audit trail of every scan with detailed reports and trend analysis.",
    icon: "history",
    color: "from-slate-400 to-slate-600",
  },
  {
    id: "feat_08",
    title: "AI Copilot",
    description:
      "Chat with your personal security expert 24/7 for instant threat analysis and advice.",
    icon: "bot",
    color: "from-blue-500 to-indigo-500",
    badge: "AI",
  },
];

export const MOCK_PRICING: PricingPlan[] = [
  {
    id: "plan_free",
    name: "Free",
    price: 0,
    period: "month",
    description: "For individuals starting their cybersecurity journey",
    features: [
      "10 URL scans per day",
      "5 email scans per day",
      "Basic threat reports",
      "Cyber Health Score",
      "Community support",
    ],
    highlighted: false,
    cta: "Get Started Free",
  },
  {
    id: "plan_premium",
    name: "Premium",
    price: 12,
    period: "month",
    description: "For power users who need complete protection",
    features: [
      "Unlimited URL scans",
      "Unlimited email scans",
      "Image & QR scanning",
      "AI Copilot (unlimited)",
      "Advanced threat reports",
      "Real-time threat alerts",
      "PDF report export",
      "Priority support",
    ],
    highlighted: true,
    badge: "Most Popular",
    cta: "Start Premium Trial",
  },
  {
    id: "plan_family",
    name: "Family",
    price: 24,
    period: "month",
    description: "Protect your entire family with one plan",
    features: [
      "Everything in Premium",
      "Up to 6 family members",
      "Family dashboard",
      "Parental controls",
      "Child safety filters",
      "Shared threat alerts",
      "Family cyber score",
      "Dedicated support",
    ],
    highlighted: false,
    cta: "Protect Your Family",
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "test_01",
    name: "Sarah Chen",
    role: "CISO",
    company: "TechCorp Inc.",
    avatar: "SC",
    content:
      "Sentinel AI caught a sophisticated phishing campaign targeting our executives before a single employee clicked a link. The AI explanations are clear enough for non-technical staff to understand.",
    rating: 5,
  },
  {
    id: "test_02",
    name: "Marcus Johnson",
    role: "Freelance Developer",
    company: "Self-employed",
    avatar: "MJ",
    content:
      "I scan every client email and external link through Sentinel. Saved me from a credential-stealing attack last month. The risk meter UI is incredibly intuitive.",
    rating: 5,
  },
  {
    id: "test_03",
    name: "Priya Patel",
    role: "Security Analyst",
    company: "FinanceGuard",
    avatar: "PP",
    content:
      "The threat intelligence integration is exceptional. Real-time CVE feeds and dark web monitoring in one dashboard — this replaced three separate tools for our team.",
    rating: 5,
  },
  {
    id: "test_04",
    name: "James Wilson",
    role: "IT Manager",
    company: "Healthcare Plus",
    avatar: "JW",
    content:
      "The family plan gives my team peace of mind about their personal devices too. The AI copilot answers complex security questions better than most consultants I've worked with.",
    rating: 5,
  },
];

export const MOCK_FAQ = [
  {
    id: "faq_01",
    question: "How does Sentinel AI detect threats?",
    answer:
      "Sentinel AI uses a multi-layer detection engine that combines machine learning models trained on millions of threats, real-time threat intelligence from 70+ feeds including VirusTotal, URLhaus, and Shodan, pattern recognition algorithms, and behavioral analysis to identify even zero-day threats.",
  },
  {
    id: "faq_02",
    question: "Is my data stored or shared?",
    answer:
      "Your scanned content is encrypted in transit and analyzed in isolated sandboxes. We do not store the content of your emails or screenshots beyond the analysis session. Anonymous threat metadata may be used to improve our models, but no personally identifiable data is ever shared with third parties.",
  },
  {
    id: "faq_03",
    question: "How accurate is the AI detection?",
    answer:
      "Our models achieve 99.2% accuracy on known threats with less than 0.3% false positive rate, validated against industry benchmarks. For novel/zero-day threats, our behavioral analysis provides leading indicators with ~94% accuracy.",
  },
  {
    id: "faq_04",
    question: "Can I use Sentinel AI as a team?",
    answer:
      "Yes! The Family plan supports up to 6 users. For enterprise teams, contact us for custom enterprise pricing with SSO, audit logs, SIEM integration, and dedicated support.",
  },
  {
    id: "faq_05",
    question: "What happens if I exceed my scan limit?",
    answer:
      "On the Free plan, scans will pause until the next day resets. You'll receive a notification and can upgrade to Premium for unlimited scans at any time — no scan history is lost during upgrade.",
  },
  {
    id: "faq_06",
    question: "Do you have a browser extension?",
    answer:
      "Yes! Sentinel AI browser extensions are available for Chrome, Firefox, and Edge. They provide real-time URL analysis as you browse, with instant warnings before you visit risky sites.",
  },
];

export const AI_SUGGESTED_PROMPTS = [
  "Explain this phishing email to me",
  "What is my current cyber risk level?",
  "How can I improve my Cyber Score?",
  "Is this URL safe to visit?",
  "What are the latest scam trends?",
  "How do I set up 2FA?",
  "Explain my last threat report",
  "What is a zero-day vulnerability?",
];

export const MOCK_ACTIVITY_FEED = [
  {
    id: "act_01",
    type: "threat_blocked",
    message: "Blocked phishing URL: paypal-verify.xyz",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    severity: "critical" as const,
  },
  {
    id: "act_02",
    type: "scan_complete",
    message: "URL scan completed: github.com (Safe)",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    severity: "safe" as const,
  },
  {
    id: "act_03",
    type: "scan_complete",
    message: "Email analyzed: noreply@amazon.com (Safe)",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    severity: "safe" as const,
  },
  {
    id: "act_04",
    type: "threat_blocked",
    message: "High-risk QR code detected",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    severity: "high" as const,
  },
  {
    id: "act_05",
    type: "achievement",
    message: "Achievement unlocked: Threat Hunter",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    severity: "safe" as const,
  },
];
