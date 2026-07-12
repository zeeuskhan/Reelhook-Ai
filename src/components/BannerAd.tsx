import React, { useEffect, useRef } from 'react';

const BannerAd: React.FC = () => {
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
                  'key' : '6b6777c4248ba9b31f1a7f8087ca4b49',
                  'format' : 'iframe',
                  'height' : 90,
                  'width' : 728,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://endedstrung.com/6b6777c4248ba9b31f1a7f8087ca4b49/invoke.js"></script>
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, []);

  return (
    <div className="flex justify-center my-8 overflow-hidden">
      <iframe
        ref={iframeRef}
        title="Banner Ad"
        width="728"
        height="90"
        scrolling="no"
        className="max-w-full overflow-hidden"
        style={{ border: 'none', width: '728px', height: '90px' }}
      />
    </div>
  );
};

export default BannerAd;
