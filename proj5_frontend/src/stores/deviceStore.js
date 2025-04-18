import { create } from 'zustand';

export const deviceStore = create((set) => ({
  mediaType: {
    isDesktopOrLaptop: false,
    isBigScreen: false,
    isTabletOrMobile: false,
    isPortrait: false,
    isRetina: false,
  },
  updateMediaType: (mediaType) => set({ mediaType }),
}));

