import React, { useEffect, useRef } from 'react';

const FooterAd: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
              </style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key' : '68e74af62003701085edf5c2422fb9f7',
                  'format' : 'iframe',
                  'height' : 60,
                  'width' : 468,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://endedstrung.com/68e74af62003701085edf5c2422fb9f7/invoke.js"></script>
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, []);

  return (
    <div className="flex justify-center mt-10 mb-5 overflow-hidden px-4">
      <iframe
        ref={iframeRef}
        title="Footer Ad"
        width="468"
        height="60"
        scrolling="no"
        className="max-w-full overflow-hidden"
        style={{ border: 'none', width: '468px', height: '60px' }}
      />
    </div>
  );
};

export default FooterAd;
