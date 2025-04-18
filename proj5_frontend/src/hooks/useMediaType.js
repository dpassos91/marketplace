// hooks/useMediaType.js
import { useState, useEffect } from 'react';
import { deviceStore } from '../stores/deviceStore'; // ou caminho correto

function useMediaType() {
  const updateMediaType = deviceStore((state) => state.updateMediaType);

  const handleResize = () => {
    const mediaType = {
      isDesktopOrLaptop: window.matchMedia('(min-width: 1224px)').matches,
      isBigScreen: window.matchMedia('(min-width: 1824px)').matches,
      isTabletOrMobile: window.matchMedia('(max-width: 1224px)').matches,
      isPortrait: window.matchMedia('(orientation: portrait)').matches,
      isRetina: window.matchMedia('(min-resolution: 2dppx)').matches,
    };

    updateMediaType(mediaType);
  };

  useEffect(() => {
    handleResize(); // Inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
}

export default useMediaType;
