"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Upload, X, Loader2, FileText, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { RiskMeter } from "@/components/scanner/RiskMeter";
import { cn } from "@/lib/utils";

const MOCK_OCR_RESULT = {
  riskScore: 67,
  extractedText: `CONGRATULATIONS! You have been selected as our winner!
  
Claim your $5,000 Amazon gift card NOW!
Visit: https://amaz0n-gifts.xyz/claim?ref=winner
Offer expires in 24 HOURS. ACT NOW.
  
Call: +1-855-555-GIFT (limited time)`,
  threats: [
    "Prize/lottery scam pattern detected",
    "Typosquatted domain: amaz0n-gifts.xyz",
    "Artificial time pressure: '24 HOURS'",
    "Premium rate phone number pattern",
  ],
  summary: "This image contains a classic prize scam designed to lure victims with fake rewards. The URL uses a typosquatted Amazon domain to steal personal and financial information.",
};

export default function ImageScannerPage() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [result, setResult] = useState<typeof MOCK_OCR_RESULT | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    setOcrProgress(0);

    const stages = [20, 45, 70, 90, 100];
    for (const p of stages) {
      await new Promise((r) => setTimeout(r, 400));
      setOcrProgress(p);
    }

    setResult(MOCK_OCR_RESULT);
    setIsScanning(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Image Scanner</h1>
        </div>
        <p className="text-slate-400 text-sm">
          Upload a screenshot or image. OCR extracts text and AI detects scam patterns.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card border border-white/10 p-6"
      >
        {!file ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300",
              dragOver
                ? "border-amber-500/50 bg-amber-500/10"
                : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
            )}
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Upload className="w-8 h-8 text-amber-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">
                Drop an image here or click to upload
              </p>
              <p className="text-slate-400 text-sm mt-1">
                PNG, JPG, WEBP — screenshots, message photos, documents
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <span className="text-white text-sm font-medium">{file.name}</span>
              </div>
              <button
                onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {preview && (
              <div className="relative rounded-xl overflow-hidden max-h-64">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" className="w-full h-full object-contain bg-black/30" />
                {isScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                    <div className="w-full max-w-xs px-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                        <span className="text-amber-400 text-sm">OCR scanning…</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                          animate={{ width: `${ocrProgress}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <p className="text-slate-400 text-xs mt-2">{ocrProgress}% complete</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                {isScanning ? "Analyzing…" : "Analyze Image"}
              </button>
            </div>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Risk */}
            <div className="glass-card border border-amber-500/30 bg-amber-500/5 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <RiskMeter score={result.riskScore} size="md" />
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Suspicious Content Detected</h2>
                  <p className="text-slate-400 text-sm">Medium-high risk: Prize/lottery scam indicators found</p>
                </div>
              </div>
            </div>

            {/* Extracted text */}
            <div className="glass-card border border-white/10 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Extracted Text (OCR)
              </h3>
              <pre className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 text-slate-300 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                {result.extractedText}
              </pre>
            </div>

            {/* Threats */}
            <div className="glass-card border border-white/10 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Detected Threats
              </h3>
              <div className="space-y-2.5">
                {result.threats.map((t) => (
                  <div key={t} className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            <div className="glass-card border border-amber-500/20 bg-amber-500/5 p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">AI</span>
                </div>
                AI Summary
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">{result.summary}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
