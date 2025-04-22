import { create } from 'zustand';

export const notificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  chatUser: null,

  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
      unreadCount: state.unreadCount + 1,
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        read: true
      })),
      unreadCount: 0,
    })),

  clearNotifications: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),

  openChatWith: (username) => set({ chatUser: username }),
  closeChat: () => set({ chatUser: null }),
}));
