import { create } from "zustand";
import type { ChatMessage, ChatSession, Notification, ScanHistory, UserProfile } from "@/types";
import { MOCK_USER, MOCK_SCAN_HISTORY, MOCK_NOTIFICATIONS, MOCK_INITIAL_MESSAGES } from "@/constants/mock-data";
import { generateId } from "@/lib/utils";

interface AppState {
  // User
  user: UserProfile;
  
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Scan History
  scanHistory: ScanHistory[];
  addScanResult: (scan: ScanHistory) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: () => number;

  // Chat
  chatSessions: ChatSession[];
  activeChatSessionId: string | null;
  setActiveChatSession: (id: string | null) => void;
  addChatSession: () => void;
  addMessage: (sessionId: string, message: Omit<ChatMessage, "id">) => void;
  getActiveMessages: () => ChatMessage[];
}

export const useAppStore = create<AppState>((set, get) => ({
  user: MOCK_USER,
  sidebarOpen: true,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  scanHistory: MOCK_SCAN_HISTORY,
  addScanResult: (scan) =>
    set((s) => ({ scanHistory: [scan, ...s.scanHistory] })),

  notifications: MOCK_NOTIFICATIONS,
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  chatSessions: [
    {
      id: "sess_default",
      title: "New conversation",
      messages: MOCK_INITIAL_MESSAGES,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  activeChatSessionId: "sess_default",
  setActiveChatSession: (id) => set({ activeChatSessionId: id }),
  addChatSession: () => {
    const id = `sess_${generateId()}`;
    const newSession: ChatSession = {
      id,
      title: "New conversation",
      messages: [...MOCK_INITIAL_MESSAGES],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((s) => ({
      chatSessions: [newSession, ...s.chatSessions],
      activeChatSessionId: id,
    }));
  },
  addMessage: (sessionId, message) =>
    set((s) => ({
      chatSessions: s.chatSessions.map((sess) =>
        sess.id === sessionId
          ? {
              ...sess,
              messages: [
                ...sess.messages,
                { ...message, id: `msg_${generateId()}` },
              ],
              updatedAt: new Date(),
            }
          : sess
      ),
    })),
  getActiveMessages: () => {
    const { chatSessions, activeChatSessionId } = get();
    const session = chatSessions.find((s) => s.id === activeChatSessionId);
    return session?.messages ?? [];
  },
}));
