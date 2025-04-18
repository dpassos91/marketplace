// hooks/useMediaType.js
import { useEffect } from 'react';
import { deviceStore } from '../stores/deviceStore';

function useMediaType() {
  const mediaType = deviceStore((state) => state.mediaType);
  const updateMediaType = deviceStore((state) => state.updateMediaType);

  const handleResize = () => {
    const newMediaType = {
      isDesktopOrLaptop: window.matchMedia('(min-width: 1224px)').matches,
      isBigScreen: window.matchMedia('(min-width: 1824px)').matches,
      isTabletOrMobile: window.matchMedia('(max-width: 1224px)').matches,
      isPortrait: window.matchMedia('(orientation: portrait)').matches,
      isRetina: window.matchMedia('(min-resolution: 2dppx)').matches,
    };

    updateMediaType(newMediaType);
  };

  useEffect(() => {
    handleResize(); // Inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return mediaType;
}

export default useMediaType;
