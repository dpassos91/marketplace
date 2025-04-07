import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

export const userStore = create(
    persist(
        (set) => ({
            // Estado inicial
            username: "",
            mediatype: {},
            locale: "pt",
            //notifications: [], // state variable to keep all notifications
            
            // Ações
            updateName: (username) => set({ username }),
            updateMediatype: (mediatype) => set({ mediatype }),
            updateLocale: (locale) => set({ locale }),
            //updateNotifications: (notifications) => set=({notifications}),
            //addNotification: (newNotification) => set((state) => ({notifications:
                //[...state.notifications, newNotification]}))

        }),
        { 
            name: 'mystore',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
);