import React, { useEffect, useRef } from 'react';

const SkyscraperAd: React.FC = () => {
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
                  'key' : '8a88a488fc0002bebafce38bde5ddaf7',
                  'format' : 'iframe',
                  'height' : 600,
                  'width' : 160,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://endedstrung.com/8a88a488fc0002bebafce38bde5ddaf7/invoke.js"></script>
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
        title="Skyscraper Ad"
        width="160"
        height="600"
        scrolling="no"
        className="max-w-full overflow-hidden"
        style={{ border: 'none', width: '160px', height: '600px' }}
      />
    </div>
  );
};

export default SkyscraperAd;
