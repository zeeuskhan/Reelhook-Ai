import React, { useEffect } from 'react';

const PopupAd: React.FC = () => {
  useEffect(() => {
    // Check if the ad has already been shown in this session (or persistent if using localStorage)
    // The user requested "once per session" but mentioned "localStorage" in details.
    // We'll use localStorage to be safe as per the specific implementation detail.
    const hasShown = localStorage.getItem('popupAdShown');

    if (!hasShown) {
      const timer = setTimeout(() => {
        const script = document.createElement('script');
        script.src = 'https://pl29066198.profitablecpmratenetwork.com/f0/71/96/f07196f623babcc623ee6026e0254474.js';
        script.async = true;
        
        // Append to body as requested
        document.body.appendChild(script);
        
        // Set flag to prevent showing again
        localStorage.setItem('popupAdShown', 'true');
        
        console.log('Popup ad script injected after 8s delay');
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, []);

  return null; // This component doesn't render any UI itself
};

export default PopupAd;
