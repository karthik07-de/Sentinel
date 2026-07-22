"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Mail, ArrowLeft, Zap } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    console.log(data);
    toast.success("Reset link sent!", { description: "Check your email inbox." });
    setSent(true);
    setIsLoading(false);
  };

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-glow-blue">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-bold text-xl">
                  Sentinel<span className="text-blue-400">AI</span>
                </span>
              </Link>
            </div>

            <div className="glass-card border border-white/10 rounded-2xl p-8">
              {sent ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
                  <p className="text-slate-400 text-sm mb-6">
                    We&apos;ve sent a password reset link to your inbox.
                  </p>
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all"
                  >
                    Back to Sign In
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Forgot password?</h1>
                    <p className="text-slate-400 text-sm">
                      Enter your email and we&apos;ll send you a reset link.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="you@example.com"
                          className={cn(
                            "w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-slate-500 text-sm focus:outline-none transition-colors",
                            errors.email
                              ? "border-red-500/50 focus:border-red-500"
                              : "border-white/10 focus:border-blue-500/50"
                          )}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1.5 text-red-400 text-xs">{errors.email.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-glow-blue disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                      {isLoading ? "Sending…" : "Send Reset Link"}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link
                      href="/auth/login"
                      className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to Sign In
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
