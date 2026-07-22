"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Upload, X, Loader2, Link, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { RiskMeter } from "@/components/scanner/RiskMeter";
import { cn } from "@/lib/utils";

const SAFE_QR = {
  riskScore: 8,
  decodedUrl: "https://www.google.com/maps/place/Central+Park",
  type: "URL",
  findings: ["Domain verified: google.com", "HTTPS enabled", "No redirects detected"],
  safe: true,
  summary: "This QR code points to Google Maps. No threats detected.",
};

const RISKY_QR = {
  riskScore: 87,
  decodedUrl: "https://qr-gift-card.xyz/claim?src=qr_sticker",
  type: "URL",
  findings: [
    "Unknown domain registered 5 days ago",
    "Multiple redirects to credential harvesting page",
    "Pattern matches gift card scam template",
  ],
  safe: false,
  summary: "This QR code leads to a suspected phishing site that harvests personal information under the guise of a gift card offer.",
};

export default function QRScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<typeof SAFE_QR | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [useRisky, setUseRisky] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
    setResult(null);
  };

  const handleScan = async () => {
    if (!file && !useRisky) {
      toast.error("Please upload a QR code image");
      return;
    }
    setIsScanning(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2000));
    setResult(useRisky ? RISKY_QR : SAFE_QR);
    setIsScanning(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">QR Scanner</h1>
        </div>
        <p className="text-slate-400 text-sm">
          Decode and analyze QR codes for hidden threats before scanning them with your device.
        </p>
      </motion.div>

      {/* Demo toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => { setUseRisky(false); setResult(null); }}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-all",
            !useRisky ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "glass border border-white/10 text-slate-400"
          )}
        >
          Demo: Safe QR
        </button>
        <button
          onClick={() => { setUseRisky(true); setResult(null); }}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-all",
            useRisky ? "bg-red-500/20 text-red-400 border border-red-500/30" : "glass border border-white/10 text-slate-400"
          )}
        >
          Demo: Risky QR
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card border border-white/10 p-6"
      >
        {!file ? (
          <div className="space-y-6">
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-white/10 hover:border-emerald-500/30 rounded-xl p-10 flex flex-col items-center gap-4 cursor-pointer transition-all hover:bg-emerald-500/5"
            >
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">Upload QR Code Image</p>
                <p className="text-slate-400 text-sm mt-1">Or use the demo buttons above</p>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>PNG, JPG, WEBP supported</span>
              </div>
            </div>

            <button
              onClick={handleScan}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all"
            >
              {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
              {isScanning ? "Scanning…" : `Analyze Demo QR (${useRisky ? "Risky" : "Safe"})`}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium">{file.name}</span>
              <button onClick={() => { setFile(null); setPreview(null); setResult(null); }}>
                <X className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
              </button>
            </div>
            {preview && (
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="QR" className="max-h-48 rounded-xl border border-white/10" />
              </div>
            )}
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all disabled:opacity-60"
            >
              {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
              {isScanning ? "Decoding & Analyzing…" : "Analyze QR Code"}
            </button>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className={cn(
              "glass-card border p-6",
              result.safe ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"
            )}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <RiskMeter score={result.riskScore} />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {result.safe
                      ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                      : <AlertTriangle className="w-5 h-5 text-red-400" />}
                    <h2 className="text-xl font-bold text-white">
                      {result.safe ? "Safe QR Code" : "Dangerous QR Code"}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300 font-mono text-sm truncate max-w-xs">{result.decodedUrl}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card border border-white/10 p-6">
              <h3 className="text-white font-semibold mb-4">Analysis Results</h3>
              <div className="space-y-2.5">
                {result.findings.map((f) => (
                  <div key={f} className={cn(
                    "flex items-start gap-2.5 px-4 py-3 rounded-xl border",
                    result.safe ? "bg-emerald-500/5 border-emerald-500/10" : "bg-red-500/5 border-red-500/10"
                  )}>
                    {result.safe
                      ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      : <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                    <span className="text-slate-300 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={cn(
              "glass-card border p-6",
              result.safe ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"
            )}>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-[10px] bg-gradient-to-br from-emerald-500 to-teal-500 w-5 h-5 rounded-full flex items-center justify-center text-white font-bold">AI</span>
                Summary
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">{result.summary}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
