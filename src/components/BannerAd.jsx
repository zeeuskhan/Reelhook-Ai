import { useEffect } from "react";

export default function BannerAd() {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.innerHTML = `
      atOptions = {
        'key' : '6b6777c4248ba9b31f1a7f8087ca4b49',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    const script2 = document.createElement("script");
    script2.src =
      "https://www.highperformanceformat.com/6b6777c4248ba9b31f1a7f8087ca4b49/invoke.js";
    script2.async = true;

    document.getElementById("banner-ad-container")?.appendChild(script1);
    document.getElementById("banner-ad-container")?.appendChild(script2);
  }, []);

  return (
    <div
      id="banner-ad-container"
      style={{ textAlign: "center", margin: "20px 0" }}
    ></div>
  );
}
