import React, { useEffect, useRef } from 'react';

const BannerAd: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.firstChild) {
      const atOptionsScript = document.createElement('script');
      atOptionsScript.type = 'text/javascript';
      atOptionsScript.innerHTML = `
        window.atOptions = {
          'key' : '6b6777c4248ba9b31f1a7f8087ca4b49',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = 'https://www.highperformanceformat.com/6b6777c4248ba9b31f1a7f8087ca4b49/invoke.js';
      invokeScript.async = true;

      adRef.current.appendChild(atOptionsScript);
      adRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <div className="flex justify-center my-8 overflow-hidden">
      <div 
        ref={adRef} 
        id="banner-ad-container"
        className="max-w-full overflow-x-auto"
        style={{ minHeight: '90px', minWidth: '728px' }}
      >
        {/* The ad will be injected here */}
      </div>
    </div>
  );
};

export default BannerAd;
