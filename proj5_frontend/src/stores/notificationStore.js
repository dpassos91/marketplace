import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const notificationStore = create(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      chatUser: null,

      addNotification: (notification) =>
        set((state) => {
          const alreadyExists = state.notifications.some((n) => n.id === notification.id);
      
          if (alreadyExists) {
            return state; // não altera nada se já existir
          }
      
          return {
            notifications: [...state.notifications, notification],
            unreadCount: state.unreadCount + 1,
          };
        }),
      

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            read: true,
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
    }),
    {
      name: 'notification-store', // chave no localStorage
    }
  )
);
