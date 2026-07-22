import type { Metadata } from "next";
import "@/styles/globals.css";
import { QueryProvider } from "@/components/common/QueryProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Sentinel AI — Protecting Your Digital Life with AI",
    template: "%s | Sentinel AI",
  },
  description:
    "Sentinel AI is the most advanced AI-powered cybersecurity platform. Scan URLs, emails, images, and QR codes for threats in real-time.",
  keywords: [
    "cybersecurity",
    "AI security",
    "phishing detection",
    "URL scanner",
    "email security",
    "threat intelligence",
  ],
  authors: [{ name: "Sentinel AI" }],
  creator: "Sentinel AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sentinelai.io",
    title: "Sentinel AI — Protecting Your Digital Life with AI",
    description:
      "The most advanced AI-powered cybersecurity platform. Detect threats before you.",
    siteName: "Sentinel AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sentinel AI — Protecting Your Digital Life with AI",
    description:
      "The most advanced AI-powered cybersecurity platform. Detect threats before you.",
    creator: "@sentinelai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <QueryProvider>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f8fafc",
                backdropFilter: "blur(20px)",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
