"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Eye, EyeOff, Zap, Github, Chrome } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { cn } from "@/lib/utils";
import { authApi, tokenStore } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data.email, data.password);
      tokenStore.set(res.accessToken, res.refreshToken);
      toast.success("Welcome back!", { description: `Hello ${res.user.name} 👋` });
      router.push("/dashboard");
    } catch (err: any) {
      toast.error("Sign in failed", { description: err.message || "Invalid credentials" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-center mb-8">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-glow-blue">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-bold text-xl">Sentinel<span className="text-blue-400">AI</span></span>
              </Link>
            </div>

            <div className="glass-card border border-white/10 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
                <p className="text-slate-400 text-sm">Sign in to your security dashboard</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[{ icon: Github, label: "GitHub" }, { icon: Chrome, label: "Google" }].map(({ icon: Icon, label }) => (
                  <button key={label} className="flex items-center justify-center gap-2 py-3 rounded-xl glass border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-sm font-medium transition-all">
                    <Icon className="w-4 h-4" />{label}
                  </button>
                ))}
              </div>

              <div className="relative flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-slate-500 text-xs">or continue with email</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input {...register("email")} type="email" placeholder="you@example.com"
                      className={cn("w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-slate-500 text-sm focus:outline-none transition-colors",
                        errors.email ? "border-red-500/50" : "border-white/10 focus:border-blue-500/50")} />
                  </div>
                  {errors.email && <p className="mt-1.5 text-red-400 text-xs">{errors.email.message}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                    <Link href="/auth/forgot-password" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••"
                      className={cn("w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border text-white placeholder:text-slate-500 text-sm focus:outline-none transition-colors",
                        errors.password ? "border-red-500/50" : "border-white/10 focus:border-blue-500/50")} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-red-400 text-xs">{errors.password.message}</p>}
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-glow-blue disabled:opacity-60 disabled:cursor-not-allowed">
                  {isLoading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
                  ) : (
                    <><Zap className="w-4 h-4" />Sign In</>
                  )}
                </button>
              </form>

              <p className="text-center text-slate-500 text-sm mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium">Sign up free</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
