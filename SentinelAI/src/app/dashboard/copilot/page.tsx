"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Plus, Loader2, User, Sparkles } from "lucide-react";
import { useAppStore } from "@/store";
import { AI_SUGGESTED_PROMPTS } from "@/constants/mock-data";
import { cn } from "@/lib/utils";

export default function CopilotPage() {
  const { getActiveMessages, addMessage, activeChatSessionId, addChatSession } = useAppStore();
  const messages = getActiveMessages();
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isThinking || !activeChatSessionId) return;
    setInput("");
    addMessage(activeChatSessionId, { role: "user", content: text, timestamp: new Date() });
    setIsThinking(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    addMessage(activeChatSessionId, {
      role: "assistant",
      content: `I've analyzed your question about **"${text}"**.\n\nAs your Sentinel AI Copilot, I recommend:\n\n1. Always verify the source before taking action\n2. Use the built-in scanners to check any suspicious content\n3. Check your Cyber Health Score regularly\n\nWould you like me to run a scan or explain anything in more detail?`,
      timestamp: new Date(),
    });
    setIsThinking(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold">AI Copilot</h1>
            <p className="text-slate-500 text-xs">Your personal cybersecurity assistant</p>
          </div>
        </div>
        <button
          onClick={addChatSession}
          className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/10 text-slate-300 hover:text-white text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
              msg.role === "user"
                ? "bg-blue-500/20"
                : "bg-gradient-to-br from-blue-500 to-purple-600"
            )}>
              {msg.role === "user"
                ? <User className="w-4 h-4 text-blue-400" />
                : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={cn(
              "max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
              msg.role === "user"
                ? "bg-blue-600/20 border border-blue-500/20 text-white"
                : "glass-card text-slate-200"
            )}>
              {msg.content.split("\n").map((line, i) => (
                <p key={i} className={line === "" ? "h-2" : ""}>{line}</p>
              ))}
            </div>
          </motion.div>
        ))}

        {isThinking && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="glass-card px-4 py-3 rounded-2xl flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              <span className="text-slate-400 text-sm">Thinking…</span>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="px-6 pb-2">
          <p className="text-slate-500 text-xs mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Suggested prompts
          </p>
          <div className="flex flex-wrap gap-2">
            {AI_SUGGESTED_PROMPTS.slice(0, 4).map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="px-3 py-1.5 rounded-full glass border border-white/10 text-slate-300 hover:text-white text-xs transition-all hover:border-blue-500/30"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 border-t border-white/[0.07]">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder="Ask me anything about cybersecurity…"
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/40 transition-colors"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isThinking}
            className="w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-blue"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
