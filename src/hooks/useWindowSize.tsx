import { useEffect, useState } from 'react';

export interface Size {
  width: number;
  height: number;
  outerHeight: number;
}

type SizeHook = [Size];

export const useWindowSize = (): SizeHook => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight,
    outerHeight: window.outerHeight,
  });

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        outerHeight: window.outerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Call handleResize directly to initialize the window size
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

  return [windowSize];
};
