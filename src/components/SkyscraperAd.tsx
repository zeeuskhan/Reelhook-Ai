import React, { useEffect, useRef } from 'react';

const SkyscraperAd: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.firstChild) {
      const atOptionsScript = document.createElement('script');
      atOptionsScript.type = 'text/javascript';
      atOptionsScript.innerHTML = `
        window.atOptions = {
          'key' : '8a88a488fc0002bebafce38bde5ddaf7',
          'format' : 'iframe',
          'height' : 600,
          'width' : 160,
          'params' : {}
        };
      `;
      
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = 'https://www.highperformanceformat.com/8a88a488fc0002bebafce38bde5ddaf7/invoke.js';
      invokeScript.async = true;

      adRef.current.appendChild(atOptionsScript);
      adRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <div className="flex justify-center my-8 overflow-hidden">
      <div 
        ref={adRef} 
        id="skyscraper-ad-container"
        className="max-w-full overflow-x-auto"
        style={{ minHeight: '600px', minWidth: '160px' }}
      >
        {/* The ad will be injected here */}
      </div>
    </div>
  );
};

export default SkyscraperAd;
