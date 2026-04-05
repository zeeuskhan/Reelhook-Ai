import React, { useEffect, useRef } from 'react';

const FooterAd: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure we only inject the script once
    if (adRef.current && !adRef.current.firstChild) {
      const atOptionsScript = document.createElement('script');
      atOptionsScript.type = 'text/javascript';
      atOptionsScript.innerHTML = `
        window.atOptions = {
          'key' : '68e74af62003701085edf5c2422fb9f7',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      `;
      
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = 'https://www.highperformanceformat.com/68e74af62003701085edf5c2422fb9f7/invoke.js';

      adRef.current.appendChild(atOptionsScript);
      adRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <div className="flex justify-center mt-10 mb-5 overflow-hidden px-4">
      <div 
        ref={adRef} 
        id="footer-ad-container"
        className="max-w-full overflow-x-auto flex justify-center"
        style={{ minHeight: '60px', minWidth: '468px' }}
      >
        {/* The ad will be injected here */}
      </div>
    </div>
  );
};

export default FooterAd;
