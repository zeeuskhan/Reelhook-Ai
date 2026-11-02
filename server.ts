import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { NICHES } from "./src/data/niches.ts";
import { SEO_CATEGORY_CONTENT } from "./src/data/seoContent.ts";
import { SEO_ARTICLES } from "./src/data/seoArticles.ts";
import { TOOL_SEO_CONTENT } from "./src/data/toolSEOContent.ts";
import { BLOG_POSTS } from "./src/data/blog.ts";
import { enhanceArticleContentAndInterlink } from "./src/utils/seoHelper.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shared Express application for both local hosting and Vercel serverless.
const app = express();

const REDIRECT_MAP: Record<string, string> = {
  "viral-hooks-for-instagram-reels": "/best-hooks-for-instagram-reels",
  "instagram-reel-hooks": "/best-hooks-for-instagram-reels",
  "viral-reel-hooks": "/best-hooks-for-instagram-reels",
  "instagram-marketing-for-real-estate-india": "/instagram-marketing-for-real-estate-agents",
  "reels-hook-generator": "/",
  "reel-hook": "/",
  "best-viral-hook": "/",
  // Restaurant / spam menus
  "hook-and-reel-menu": "/",
  "hook-and-reel-restaurant-menu": "/",
  "hook-reel-cajun-seafood-bar-el-paso-menu": "/",
  "hook-and-reel-linden": "/",
  "hook-reel-cajun-seafood-bar-overland-park-menu": "/",
  "hook-reel-cajun-seafood-bar-austin-menu": "/",
  "hook-reel-cajun-seafood-bar-middletown-menu": "/",
  "hook-reel-cajun-seafood-bar-wichita-menu": "/",
  "hook-and-reel-cajun-seafood-and-bar-sacramento-menu": "/",
  "hook-reel-cajun-seafood-bar-killeen-menu": "/",
  "hooker-electric-80wa-fishing-reel": "/",
  "hook-and-reel-gift-cards-promo-codes-calories": "/"
};

function isTier1Url(cleanPath: string): boolean {
  if (cleanPath === "/" || cleanPath === "") return true;

  const exactTier1Paths = [
    "/explore",
    "/about",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    "/blog",
    "/sitemap",
    "/calculators",
    "/medical-disclaimer",
    "/tdee-calculator"
  ];
  if (exactTier1Paths.includes(cleanPath)) return true;

  // Check if it is a blog post
  if (cleanPath.startsWith("/blog/")) {
    const slug = cleanPath.replace("/blog/", "");
    return BLOG_POSTS.some(post => post.slug === slug);
  }

  // Check if it is a tool
  if (cleanPath.startsWith("/tools/")) {
    const slug = cleanPath.replace("/tools/", "");
    const whitelistedTools = [
      "instagram-bio-generator",
      "instagram-caption-generator",
      "instagram-hashtag-generator",
      "instagram-reel-generator",
      "instagram-username-generator",
      "instagram-dp-generator",
      "instagram-transcript-generator",
      "instagram-mockup-generator",
      "hook-generator"
    ];
    return whitelistedTools.includes(slug);
  }

  // Niche landing pages and their supported language variants.
  if (cleanPath.startsWith("/hooks/")) {
    const slug = cleanPath.replace("/hooks/", "").toLowerCase();
    const languages = ["english", "hindi", "hinglish", "spanish", "french"];

    // The unsuffixed URL is the English/default pillar page.
    if (NICHES.some(n => n.id.toLowerCase() === slug)) return true;

    // A language suffix is indexable only when the remaining slug maps to
    // a real niche or one of its configured subcategories.
    const language = languages.find(lang => slug.endsWith(`-${lang}`));
    if (!language) return false;

    const nicheSlug = slug.slice(0, -(language.length + 1));
    return NICHES.some(n =>
      n.id.toLowerCase() === nicheSlug ||
      n.subcategories.some(sub =>
        sub.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") === nicheSlug
      )
    );
  }

  // Check if it is one of our premium articles served at /:slug
  if (cleanPath.startsWith("/")) {
    const slug = cleanPath.substring(1);
    const premiumArticles = [
      "best-hooks-for-instagram-reels",
      "viral-hooks-for-instagram-reels",
      "how-to-go-viral-on-reels-2026",
      "best-time-to-post-reels-india",
      "how-to-get-first-1000-followers-instagram",
      "instagram-algorithm-explained-2026",
      "how-to-use-ai-for-content-creation",
      "monetize-instagram-reels-india",
      "increase-reel-engagement-hacks",
      "faceless-reel-channel-guide",
      "instagram-seo-tips-for-creators",
      "reel-hook-analyzer",
      "content-ideas-generator",
      "content-calendar-generator",
      "free-ai-hook-generator"
    ];
    return premiumArticles.includes(slug) && !REDIRECT_MAP[slug];
  }

  return false;
}

// Pre-rendering wrapper function for SEO
function renderSeoHtml(urlPath: string, html: string): string {
  const cleanPath = urlPath.split("?")[0].split("#")[0];

  let title = "Reel Hook Generator: Get Free Scroll-Stopping Reel Hooks (2026)";
  let description = "The #1 free AI reel hook generator online. Instantly create high-retention reel hook ideas for Instagram, TikTok & YouTube. Grow 10x faster with no signup required!";
  let canonicalUrl = `https://www.reelhooks.site${cleanPath === "/" ? "/" : cleanPath}`;
  let bodyContent = "";
  let schemasArray: any[] = [];

  // 1. Programmatic Niche pages: /hooks/:slug
  const hooksMatch = cleanPath.match(/^\/hooks\/([a-zA-Z0-9-]+)$/);
  if (hooksMatch) {
    const slug = hooksMatch[1];
    const parts = slug.split("-");
    const supportedLanguages = ["english", "hindi", "hinglish", "spanish", "french"];
    const suffix = parts[parts.length - 1]?.toLowerCase();
    const lang = supportedLanguages.includes(suffix) ? (parts.pop() || "english") : "english";
    const slugId = parts.join("-");

    const main = NICHES.find(n => n.id === slugId);
    let name = slugId.charAt(0).toUpperCase() + slugId.slice(1);
    let categoryId = slugId;
    
    if (main) {
      name = main.name;
      categoryId = main.id;
    } else {
      for (const n of NICHES) {
        const sub = n.subcategories.find(s => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slugId);
        if (sub) {
          name = sub;
          categoryId = n.id;
          break;
        }
      }
    }

    const displayLang = lang.charAt(0).toUpperCase() + lang.slice(1);
    
    // Localized Title and Description
    if (lang === "hindi") {
      title = `${name} रील हुक जनरेटर – इंस्टाग्राम और टिकटॉक के लिए वायरल हुक्स (2026)`;
      description = `इंस्टाग्राम, यूट्यूब शॉर्ट्स और टिकटॉक के लिए वायरल ${name} रील हुक हिंदी में उत्पन्न करें। अभी फ्री स्क्रॉल-स्टॉपिंग हुक टेम्पलेट्स प्राप्त करें!`;
    } else if (lang === "hinglish") {
      title = `${name} Reel Hook Generator Hinglish – Free Viral Hooks for Instagram (2026)`;
      description = `Generate viral ${name} reel hooks in Hinglish for Instagram, TikTok & YouTube Shorts. Get free scroll-stopping dynamic AI hook templates now!`;
    } else {
      title = `${name} Reel Hook Generator – Free Viral Hooks for Instagram, TikTok & Shorts (2026)`;
      description = `Generate viral ${name} reel hooks in ${displayLang} for Instagram, TikTok & YouTube Shorts. Get free scroll-stopping dynamic AI hook templates now!`;
    }

    const richContentSource = SEO_CATEGORY_CONTENT[categoryId] || SEO_CATEGORY_CONTENT["fitness"] || {
      introduction: `Struggling to get views on your ${name} reels? The first 3 seconds are everything. Our instagram hook generator has analyzed thousands of viral videos to bring you these high-performing viral reel hooks specifically optimized for the ${name} niche.`,
      section1: "", section2: "", section3: "", conclusion: ""
    };

    const replaceKeywords = (txt: string) => {
      if (!txt) return "";
      return txt
        .replace(/fitness/gi, name)
        .replace(/business/gi, name)
        .replace(/motivation/gi, name)
        .replace(/storytelling/gi, name)
        .replace(/education/gi, name)
        .replace(/marketing/gi, name)
        .replace(/finance/gi, name)
        .replace(/travel/gi, name)
        .replace(/tech/gi, name)
        .replace(/lifestyle/gi, name);
    };

    const finalIntro = replaceKeywords(richContentSource.introduction);
    const s1 = replaceKeywords(richContentSource.section1);
    const s2 = replaceKeywords(richContentSource.section2);
    const s3 = replaceKeywords(richContentSource.section3);
    const sConc = replaceKeywords(richContentSource.conclusion);

    // Localized and properly translated hooks (Issue 3 / Niche languages)
    let exampleHooks: string[] = [];
    if (lang === "hindi") {
      exampleHooks = [
        `POV: आपको आखिरकार 2026 में ${name} का राज पता चल गया...`,
        `अगर आप तेजी से बढ़ना चाहते हैं तो ${name} को इस तरह करना बंद करें!`,
        `यही कारण है कि आपके ${name} वीडियो पर केवल 200 व्यूज आ रहे हैं।`,
        `काश मुझे अपनी क्रिएटर यात्रा शुरू करने से पहले ${name} का यह राज पता होता।`,
        `क्या ${name} वास्तव में इसके लायक है? यहाँ पूरा सच है।`,
        `अपने ${name} को बेहतर बनाने के लिए इस रील को स्किप न करें!`,
        `इस एक बदलाव ने सिर्फ 7 दिनों में मेरे ${name} के परिणामों को दोगुना कर दिया।`,
        `3 बड़ी गलतियाँ जो आप अपने ${name} रील्स में रोज़ाना करते हैं।`,
        `बिना किसी बकवास के, यहाँ ${name} को मास्टर करने के 3 आसान तरीके हैं।`,
        `यह ${name} की सीक्रेट चीट शीट है जो आपको आज ही सेव करनी चाहिए।`,
        `मेरे ${name} रील्स पर 10 गुना ज़्यादा व्यूज़ लाने का एक आसान राज।`,
        `रुकिए! क्या आप भी ${name} में ये गलतियाँ कर रहे हैं?`
      ];
    } else if (lang === "hinglish") {
      exampleHooks = [
        `POV: Aapko aakhirkar 2026 mein ${name} ka secret pata chal gaya...`,
        `Agar jaldi grow karna hai toh ${name} ko aise karo band!`,
        `Yahi wajah hai ki aapke ${name} videos par sirf 200 views aate hain.`,
        `Kash mujhe apni creator journey start karne se pehle ${name} ka ye secret pata hota.`,
        `Kya ${name} sach mein worth it hai? Ye raha absolute sach.`,
        `Apne ${name} ko improve karne ke liye is reel ko scroll mat karna!`,
        `Is ek change ne sirf 7 dino mein mere ${name} results ko double kar diya.`,
        `3 badi galtiyan jo aap apne ${name} reels mein rozana karte ho.`,
        `No non-sense, ye rahe ${name} ko master karne ke 3 simple steps.`,
        `Ye ultimate ${name} cheat sheet aapko aaj hi steal karni chahiye.`,
        `Mere ${name} reels par 10x zyada engagement lane ka simple secret.`,
        `Ruko! Kya aap bhi ${name} mein ye galtiyan kar rahe ho?`
      ];
    } else {
      exampleHooks = [
        `POV: You finally learned the secret to ${name} in 2026...`,
        `Stop doing ${name} like this if you want to grow fast!`,
        `This is exactly why your ${name} videos are getting 200 views.`,
        `I wish I knew this ${name} secret before starting my creator journey.`,
        `The illegal feeling hack for ${name} that nobody is talking about.`,
        `Here is how to master ${name} in only 3 simple steps.`,
        `3 major mistakes you make daily in your ${name} reels.`,
        `Don't scroll if you are trying to improve your ${name}!`,
        `This single change doubled my ${name} results in just 7 days.`,
        `Is ${name} actually worth it? Here is the absolute truth.`,
        `The ultimate ${name} cheat sheet you need to steal today.`,
        `My simple secret for 10x visual engagement in ${name}.`,
        `Stop scrolling if you want to grow your ${name} account.`
      ];
    }

    const exampleHooksHtml = exampleHooks
      .map(h => `<div style="background:#1E293B;border:1px solid rgba(255,255,255,0.1);padding:24px;border-radius:16px;margin-bottom:16px;"><p style="font-style:italic;color:#F8FAFC;font-size:16px;margin:0;">"${h}"</p></div>`)
      .join("\n");

    const faqs = [
      {
        q: `What is the best hook for ${name} reels?`,
        a: `The absolute best hook is one that triggers high retention or a curiosity gap. Using negative constraints like 'Stop doing ${name} like this' or authority building like 'The real secret to ${name}' works amazingly well.`
      },
      {
        q: `Can I generate hooks in other languages?`,
        a: `Yes, our free tool supports multiple variations including English, Hindi, and Hinglish so you can connect with your core audience globally.`
      },
      {
        q: `How does the ${name} hook generator work?`,
        a: `Our generator uses fine-tuned models trained on high-converting social media posts. It identifies patterns and words that trigger interest and puts them into scroll-stopping copy for you.`
      },
      {
        q: `How do I go viral in the ${name} niche?`,
        a: `To go viral with ${name} content, make sure your first 3 seconds use a compelling visual hook and text hook, followed by high-tempo delivery and a clear call-to-action to save or share.`
      }
    ];

    const faqsHtml = faqs
      .map(faq => `
        <div style="margin-bottom:24px;background:#1E293B;padding:24px;border-radius:16px;border:1px solid rgba(255,255,255,0.1);">
          <h3 style="font-size:1.15rem;font-weight:700;color:#F8FAFC;margin-bottom:8px;margin-top:0;">${faq.q}</h3>
          <p style="color:#94A3B8;line-height:1.6;margin:0;">${faq.a}</p>
        </div>
      `)
      .join("\n");

    const relatedNiches = [
      { id: "fitness", name: "Fitness", emoji: "🔥" },
      { id: "finance", name: "Finance", emoji: "💰" },
      { id: "business", name: "Business", emoji: "📈" },
      { id: "lifestyle", name: "Lifestyle", emoji: "✨" },
      { id: "tech", name: "Tech", emoji: "💻" },
      { id: "education", name: "Education", emoji: "📚" },
      { id: "motivation", name: "Motivation", emoji: "💪" },
      { id: "beauty", name: "Skincare", emoji: "💆" },
      { id: "social-media", name: "Social Media", emoji: "📱" },
      { id: "health", name: "Health", emoji: "🏃" }
    ];

    const relatedNichesHtml = relatedNiches
      .filter(n => n.id !== categoryId)
      .slice(0, 6)
      .map(n => `<a href="/hooks/${n.id}-${lang}" style="background:#1E293B;border:1px solid rgba(255,255,255,0.1);padding:12px 20px;border-radius:12px;color:#F8FAFC;text-decoration:none;font-weight:600;display:inline-block;margin:6px;">${n.name} Reel Hooks ${n.emoji}</a>`)
      .join(" ");

    const breadcrumbs = `
      <nav style="font-size:14px;color:#94A3B8;margin-bottom:24px;text-align:left;">
        <a href="/" style="color:#6C5CE7;text-decoration:none;">Home</a> &gt; 
        <a href="/explore" style="color:#6C5CE7;text-decoration:none;">Explore</a> &gt; 
        <span style="color:#F8FAFC;">${name} Hooks</span>
      </nav>
    `;

    bodyContent = `
      <div style="font-family:'Inter', sans-serif;background-color:#0B0F19;color:#F8FAFC;min-height:100vh;padding:40px 20px;">
        <header style="max-width:860px;margin:40px auto;padding:0;text-align:center;">
          ${breadcrumbs}
          <h1 style="font-size:36px;font-weight:800;color:#6C5CE7;line-height:1.3;margin-bottom:16px;">Free ${name} Reel Hook Generator (${displayLang})</h1>
          <p style="font-size:18px;color:#94A3B8;line-height:1.6;">${finalIntro}</p>
        </header>
        
        <main style="max-width:860px;margin:40px auto;padding:0;">
          <section style="margin-bottom:48px;">
            <h2 style="font-size:24px;font-weight:800;color:#F8FAFC;margin-bottom:24px;text-align:center;">
              10+ Best Handpicked ${name} Reel Hook Examples (Stop the Scroll)
            </h2>
            <div style="display:grid;grid-template-columns:1fr;gap:0;">
              ${exampleHooksHtml}
            </div>
          </section>

          <section style="margin-bottom:48px;color:#94A3B8;line-height:1.8;font-size:16px;">
            ${s1 ? `<div style="margin-bottom:30px;">${s1}</div>` : ""}
            ${s2 ? `<div style="margin-bottom:30px;">${s2}</div>` : ""}
            ${s3 ? `<div style="margin-bottom:30px;">${s3}</div>` : ""}
            ${sConc ? `<div>${sConc}</div>` : ""}
          </section>

          <section style="margin-bottom:48px;">
            <h2 style="font-size:24px;font-weight:800;color:#F8FAFC;margin-bottom:24px;">
              Frequently Asked Questions (FAQ) about ${name} Reel Hooks
            </h2>
            <div>
              ${faqsHtml}
            </div>
          </section>

          <section style="margin-bottom:48px;text-align:center;border-top:1px solid rgba(255,255,255,0.1);padding-top:40px;">
            <h2 style="font-size:20px;font-weight:800;color:#F8FAFC;margin-bottom:16px;">Related Niche Generators</h2>
            <div style="margin-top:12px;">
              ${relatedNichesHtml}
            </div>
          </section>
        </main>
      </div>
    `;

    schemasArray = [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.reelhooks.site/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Explore",
            "item": "https://www.reelhooks.site/explore"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": name,
            "item": canonicalUrl
          }
        ]
      }
    ];

  // Calculators hub with crawlable links to available tools.
  } else if (cleanPath === "/calculators") {
    title = "Free Online Calculators | ReelHooks";
    description = "Explore free online calculators and practical guides from ReelHooks, including the TDEE calculator for daily calorie and energy estimates.";
    bodyContent = `
      <main style="max-width:900px;margin:40px auto;padding:24px;color:#F8FAFC;font-family:Inter,sans-serif;line-height:1.75;">
        <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>Calculators</span></nav>
        <h1 style="font-size:38px;font-weight:800;margin:28px 0 16px;">Free Online Calculators</h1>
        <p>Browse practical calculators and guides. Results are estimates based on the assumptions explained on each page. Health-related tools are educational and do not replace advice from a qualified professional.</p>
        <section><h2><a href="/tdee-calculator">TDEE Calculator</a></h2><p>Estimate BMR, total daily energy expenditure and illustrative calorie targets with three equations.</p></section>
        <section><h2>Related reading</h2><ul><li><a href="/blog/tdee-calculator-daily-energy-needs-guide">Understand the TDEE formula</a></li><li><a href="/blog/how-to-use-your-tdee-calculator-result">Learn about calorie-deficit estimates</a></li></ul></section>
        <p>More calculators will be listed when they are available and tested. We do not link to unfinished tools.</p>
      </main>`;
    schemasArray = [{ "@context":"https://schema.org","@type":"CollectionPage","name":"Free Online Calculators","url":"https://www.reelhooks.site/calculators","description":description },{ "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.reelhooks.site/"},{"@type":"ListItem","position":2,"name":"Calculators","item":"https://www.reelhooks.site/calculators"}]}];

  // Dedicated TDEE calculator landing page: complete crawler-readable content.
  } else if (cleanPath === "/tdee-calculator") {
    title = "TDEE Calculator: Estimate Your Daily Calories Free";
    description = "Estimate your TDEE, BMR and daily calorie targets with three established formulas. Choose activity, units and goals in this free calculator.";
    bodyContent = `
      <main style="max-width:960px;margin:32px auto;padding:24px;color:#F8FAFC;font-family:Inter,sans-serif;line-height:1.75;">
        <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/calculators">Calculators</a> / <span>TDEE Calculator</span></nav>
        <header style="max-width:780px;margin:26px auto 32px;text-align:center;">
          <h1 style="font-size:40px;font-weight:800;margin:0 0 12px;">TDEE Calculator</h1>
          <p>Estimate your total daily energy expenditure, resting calorie needs and a practical starting point for maintenance, fat-loss or muscle-gain planning. The interactive calculator loads with example values and supports metric and imperial measurements.</p>
        </header>
        <section aria-label="TDEE calculator"><h2>Your details</h2><p>The calculator below is interactive after the page loads. Enter age, height, weight, sex category used by the equation, activity level and formula. Mifflin–St Jeor is the default; Katch–McArdle requires a body-fat estimate.</p><p><a href="#calculator-app">Go to interactive calculator</a></p><div id="calculator-app" aria-label="Interactive TDEE calculator will load here"></div></section>
        <section><h2>What is TDEE?</h2><p>Total Daily Energy Expenditure (TDEE) is the estimated energy your body uses across a full day. It includes resting energy needs, planned exercise, everyday movement and the energy used to digest food. A TDEE calculator combines a resting metabolic estimate with an activity multiplier. It cannot measure metabolism directly, but it can help explain how activity affects estimated daily calorie needs.</p></section>
        <section><h2>How to use this TDEE calculator</h2><ol><li>Select metric or imperial units and enter your current weight and height.</li><li>Enter your age and select the sex category used by the chosen equation.</li><li>Choose an activity level that reflects your typical week, including work and routine movement.</li><li>Use Mifflin–St Jeor for a general estimate, compare revised Harris–Benedict, or choose Katch–McArdle only with a credible body-fat estimate.</li><li>Review BMR, maintenance TDEE and illustrative goal options. Copy the result for your own notes.</li></ol></section>
        <section><h2>How TDEE is calculated</h2><p>First, a formula estimates basal metabolic rate (BMR), also described as resting energy expenditure. Then the calculator multiplies that estimate by an activity factor. All results are predictions rather than direct measurements.</p>
          <h3>Mifflin–St Jeor equation</h3><p>Men: BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age (years) + 5. Women: BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age (years) − 161.</p>
          <h3>Revised Harris–Benedict (Roza–Shizgal, 1984)</h3><p>Men: BMR = 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) − (5.677 × age). Women: BMR = 447.593 + (9.247 × weight in kg) + (3.098 × height in cm) − (4.330 × age).</p>
          <h3>Katch–McArdle</h3><p>BMR = 370 + (21.6 × lean body mass in kg). Lean body mass = body weight × (1 − body-fat percentage ÷ 100). This equation depends on a reasonably accurate body-fat estimate.</p>
          <p><strong>TDEE = BMR × activity multiplier.</strong> Mifflin–St Jeor coefficients match the simplified sex-specific equations in the 1990 publication. The revised Harris–Benedict coefficients match the Roza and Shizgal 1984 revision. Katch–McArdle is a commonly used lean-mass equation and is only as reliable as its body-fat input.</p>
        </section>
        <section><h2>Activity multipliers</h2><table><thead><tr><th>Activity level</th><th>Multiplier</th><th>Description</th></tr></thead><tbody><tr><td>Sedentary</td><td>1.2</td><td>Mostly sitting; little planned exercise</td></tr><tr><td>Lightly active</td><td>1.375</td><td>Light movement or exercise about 1–3 days a week</td></tr><tr><td>Moderately active</td><td>1.55</td><td>Moderate exercise about 3–5 days a week</td></tr><tr><td>Very active</td><td>1.725</td><td>Hard exercise or a physically active routine about 6–7 days a week</td></tr><tr><td>Extra active</td><td>1.9</td><td>Very demanding daily activity, hard training or physical work</td></tr></tbody></table><p>Choose a multiplier for your whole week, not only your gym sessions. A desk-based day can still involve exercise, but it may not justify the same factor as a physically demanding job plus training.</p></section>
        <section><h2>Worked examples</h2><p><strong>Example A:</strong> A 30-year-old man, 80 kg, 180 cm, moderate activity (1.55). Mifflin BMR = (10 × 80) + (6.25 × 180) − (5 × 30) + 5 = 800 + 1,125 − 150 + 5 = 1,780 kcal/day. TDEE = 1,780 × 1.55 = 2,759 kcal/day (rounded).</p><p><strong>Example B:</strong> A 30-year-old woman, 65 kg, 165 cm, moderate activity (1.55). Mifflin BMR = (10 × 65) + (6.25 × 165) − (5 × 30) − 161 = 650 + 1,031.25 − 150 − 161 = 1,370.25 kcal/day. TDEE = 1,370.25 × 1.55 = 2,123.89, or about 2,124 kcal/day.</p></section>
        <section><h2>What your result means</h2><p>Maintenance is the estimated intake at which body weight may remain broadly stable over time. A modest deficit such as 250–500 kcal/day is sometimes used as a starting point for fat loss. A modest surplus such as 150–300 kcal/day may support gradual weight gain alongside resistance training. These are examples, not prescriptions or guarantees. Do not use the calculator to set an aggressive restriction. Do not deliberately eat below estimated BMR without professional supervision; BMR is not a universal minimum intake threshold, and very low intake can create nutritional and medical risks.</p></section>
        <section><h2>Why real energy needs can differ</h2><p>People with the same age, height and weight can have different energy needs because of lean mass, body-fat distribution, sleep, medication, health conditions, temperature, stress and spontaneous movement. Activity multipliers are broad averages and are easy to overestimate. Compare your estimate with a multi-week trend rather than one day's scale reading. Recalculate after a meaningful weight or activity change.</p></section>
        <section><h2>Limitations and health disclaimer</h2><p>This general educational tool is not intended for anyone under 18, people who are pregnant or breastfeeding, people with a medical condition requiring nutrition care, or people living with or recovering from an eating disorder. It cannot assess medical history, nutritional adequacy or individual risk.</p><p><strong>Health disclaimer: Results are estimates for educational purposes only and are not medical advice, diagnosis or treatment. Consult a doctor or registered dietitian before making significant dietary changes.</strong></p></section>
        <section><h2>TDEE calculator FAQs</h2>
          <h3>What is the difference between TDEE and BMR?</h3><p>BMR estimates energy use at rest. TDEE estimates total daily energy use after movement, exercise and digestion.</p>
          <h3>How accurate is a TDEE calculator?</h3><p>It is an estimate, not a measurement. Body composition, health, sleep, medication, daily movement and activity assumptions can change actual energy needs.</p>
          <h3>How often should I recalculate my TDEE?</h3><p>Recalculate after a meaningful change in body weight or activity routine. Checking every 4–8 weeks during a changing plan may be practical, but there is no universal schedule.</p>
          <h3>How many calories should I eat to lose 0.5 kg per week?</h3><p>A rough planning estimate is a daily deficit near 500 kcal, but individual results vary and weight change is not perfectly linear.</p>
          <h3>Which activity level should I choose?</h3><p>Choose the description that best matches your whole week, not only your gym sessions. When uncertain, start conservatively and review your trend.</p>
          <h3>Which BMR formula is best?</h3><p>Mifflin–St Jeor is a widely used general adult estimate. Revised Harris–Benedict is another established option. Katch–McArdle depends on lean body mass and a reliable body-fat estimate.</p>
          <h3>Does muscle mass change TDEE?</h3><p>Body composition can affect resting energy needs, but total expenditure also depends on body size, movement, training and other factors.</p>
          <h3>Is eating below TDEE safe?</h3><p>A deficit is used in some weight-management plans, but the appropriate size depends on the person. A calculator cannot assess individual risk; seek professional advice before substantial changes.</p>
          <h3>How can I find my body-fat percentage?</h3><p>Options include trained skinfold assessment, bioelectrical impedance, DEXA or other body-composition assessments. Each method has limitations. If you lack a credible estimate, choose another equation.</p>
        </section>
        <section><h2>Related calculators</h2><p>Explore the <a href="/calculators">calculators hub</a> for related tools. Other calculators may cover BMR, BMI, calorie planning, macros, ideal weight and water intake; use each result as an estimate and review its assumptions.</p></section>
        <footer><p><strong>Last updated: 2 November 2026.</strong> This calculator runs locally in your browser. Measurement fields and calorie results are not sent to our server. Analytics events, if enabled, record interaction types without including your entered measurements.</p><p>Sources: Mifflin et al., “A new predictive equation for resting energy expenditure in healthy individuals,” American Journal of Clinical Nutrition (1990), PMID 2305711; Roza & Shizgal, “The Harris Benedict equation reevaluated,” American Journal of Clinical Nutrition (1984), PMID 6741850.</p></footer>
      </main>`;
    schemasArray = [
      { "@context": "https://schema.org", "@type": "WebApplication", "name": "Free TDEE Calculator", "url": "https://www.reelhooks.site/tdee-calculator", "description": description, "applicationCategory": "HealthApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [ { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.reelhooks.site/" }, { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://www.reelhooks.site/calculators" }, { "@type": "ListItem", "position": 3, "name": "TDEE Calculator", "item": "https://www.reelhooks.site/tdee-calculator" } ] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "What is the difference between TDEE and BMR?", "acceptedAnswer": { "@type": "Answer", "text": "BMR estimates energy use at rest. TDEE estimates total daily energy use after movement, exercise and digestion." } },
        { "@type": "Question", "name": "How accurate is a TDEE calculator?", "acceptedAnswer": { "@type": "Answer", "text": "It is an estimate, not a measurement. Body composition, health, sleep, medication, daily movement and activity assumptions can change actual energy needs." } },
        { "@type": "Question", "name": "How often should I recalculate my TDEE?", "acceptedAnswer": { "@type": "Answer", "text": "Recalculate after a meaningful change in body weight or activity routine. Checking every 4–8 weeks during a changing plan may be practical, but there is no universal schedule." } },
        { "@type": "Question", "name": "How many calories should I eat to lose 0.5 kg per week?", "acceptedAnswer": { "@type": "Answer", "text": "A rough planning estimate is a daily deficit near 500 kcal, but individual results vary and weight change is not perfectly linear." } },
        { "@type": "Question", "name": "Which activity level should I choose?", "acceptedAnswer": { "@type": "Answer", "text": "Choose the description that best matches your whole week, not only your gym sessions. When uncertain, start conservatively and review your trend." } },
        { "@type": "Question", "name": "Which BMR formula is best?", "acceptedAnswer": { "@type": "Answer", "text": "Mifflin–St Jeor is a widely used general adult estimate. Revised Harris–Benedict is another established option. Katch–McArdle depends on lean body mass and a reliable body-fat estimate." } },
        { "@type": "Question", "name": "Does muscle mass change TDEE?", "acceptedAnswer": { "@type": "Answer", "text": "Body composition can affect resting energy needs, but total expenditure also depends on body size, movement, training and other factors." } },
        { "@type": "Question", "name": "Is eating below TDEE safe?", "acceptedAnswer": { "@type": "Answer", "text": "A deficit is used in some weight-management plans, but the appropriate size depends on the person. A calculator cannot assess individual risk; seek professional advice before substantial changes." } },
        { "@type": "Question", "name": "How can I find my body-fat percentage?", "acceptedAnswer": { "@type": "Answer", "text": "Options include trained skinfold assessment, bioelectrical impedance, DEXA or other body-composition assessments. Each method has limitations. If you lack a credible estimate, choose another equation." } }
      ] }
    ];

  } else if (cleanPath === "/medical-disclaimer") {
    title = "Medical & Health Disclaimer | ReelHooks";
    description = "Read the health and medical disclaimer for ReelHooks calculators and educational content.";
    bodyContent = `<main style="max-width:800px;margin:40px auto;padding:24px;color:#F8FAFC;line-height:1.75;"><nav><a href="/">Home</a> / Medical &amp; Health Disclaimer</nav><h1>Medical &amp; Health Disclaimer</h1><p>ReelHooks provides general educational information and calculation tools. We are not a hospital, clinic, medical practice or provider of individualized medical care.</p><h2>Estimates, not medical advice</h2><p>Outputs from the TDEE calculator and other health-related tools are estimates based on mathematical equations and user-entered information. They are not a diagnosis, treatment plan, prescription or substitute for a consultation with a qualified doctor or registered dietitian.</p><h2>Who should seek professional guidance</h2><p>Do not rely on general calorie calculators if you are under 18, pregnant or breastfeeding, managing a medical condition that affects nutrition or metabolism, or living with or recovering from an eating disorder. Ask a qualified healthcare professional whether calorie tracking or dietary changes are appropriate for you.</p><h2>No guaranteed outcomes</h2><p>Actual energy needs and health outcomes vary. We do not guarantee weight loss, weight gain, fitness results or any particular outcome. Do not make major changes to food intake, medication or treatment based only on a calculator result.</p><p>Last updated: 2 November 2026. For website questions, use our <a href="/contact">Contact page</a>.</p></main>`;

  // 2. SEO Article pages: /:slug
  } else if (cleanPath !== "/" && SEO_ARTICLES[cleanPath.substring(1)]) {
    const slug = cleanPath.substring(1);
    const article = SEO_ARTICLES[slug];
    const interlinkedContent = enhanceArticleContentAndInterlink(article.content, slug);
    
    title = article.metaTitle || article.title;
    description = article.metaDescription;

    const faqsHtml = article.faqs
      .map(faq => `
        <div style="margin-bottom:24px;background:#1E293B;padding:24px;border-radius:16px;border:1px solid rgba(255,255,255,0.1);">
          <h3 style="font-size:1.15rem;font-weight:700;color:#F8FAFC;margin-bottom:8px;margin-top:0;">${faq.q}</h3>
          <p style="color:#94A3B8;line-height:1.6;margin:0;">${faq.a}</p>
        </div>
      `)
      .join("\n");

    const breadcrumbs = `
      <nav style="font-size:14px;color:#94A3B8;margin-bottom:24px;text-align:left;">
        <a href="/" style="color:#6C5CE7;text-decoration:none;">Home</a> &gt; 
        <span style="color:#F8FAFC;">${article.title}</span>
      </nav>
    `;

    bodyContent = `
      <div style="font-family:'Inter', sans-serif;background-color:#0B0F19;color:#F8FAFC;min-height:100vh;padding:40px 20px;">
        <main style="max-width:800px;margin:40px auto;padding:0;">
          ${breadcrumbs}
          <h1 style="font-size:36px;font-weight:800;color:#6C5CE7;line-height:1.3;margin-bottom:32px;">${article.h1}</h1>
          <div class="article-content" style="color:#94A3B8;line-height:1.8;font-size:16px;margin-bottom:48px;">
            ${interlinkedContent}
          </div>

          ${article.faqs.length > 0 ? `
          <section style="margin-bottom:48px;">
            <h2 style="font-size:24px;font-weight:800;color:#F8FAFC;margin-bottom:24px;">
              Frequently Asked Questions (FAQ)
            </h2>
            <div>
              ${faqsHtml}
            </div>
          </section>
          ` : ""}
        </main>
      </div>
    `;

    schemasArray = [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.h1,
        "description": article.metaDescription,
        "author": {
          "@type": "Organization",
          "name": "ReelHooks",
          "url": "https://www.reelhooks.site"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": article.faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }
    ];

  // 3. Tool SEO pages: /tools/:slug
  } else if (cleanPath.startsWith("/tools/") && TOOL_SEO_CONTENT[cleanPath.replace("/tools/", "")]) {
    const slug = cleanPath.replace("/tools/", "");
    const content = TOOL_SEO_CONTENT[slug];

    title = content.metaTitle || content.title;
    description = content.metaDescription;

    const faqsHtml = content.faqs
      .map(faq => `
        <div style="margin-bottom:24px;background:#1E293B;padding:24px;border-radius:16px;border:1px solid rgba(255,255,255,0.1);">
          <h3 style="font-size:1.15rem;font-weight:700;color:#F8FAFC;margin-bottom:8px;margin-top:0;">${faq.q}</h3>
          <p style="color:#94A3B8;line-height:1.6;margin:0;">${faq.a}</p>
        </div>
      `)
      .join("\n");

    const breadcrumbs = `
      <nav style="font-size:14px;color:#94A3B8;margin-bottom:24px;text-align:left;">
        <a href="/" style="color:#6C5CE7;text-decoration:none;">Home</a> &gt; 
        <span style="color:#F8FAFC;">${content.title}</span>
      </nav>
    `;

    bodyContent = `
      <div style="font-family:'Inter', sans-serif;background-color:#0B0F19;color:#F8FAFC;min-height:100vh;padding:40px 20px;">
        <main style="max-width:800px;margin:40px auto;padding:0;">
          ${breadcrumbs}
          <h1 style="font-size:36px;font-weight:800;color:#6C5CE7;line-height:1.3;margin-bottom:16px;">${content.h1}</h1>
          <p style="font-size:18px;color:#94A3B8;line-height:1.6;margin-bottom:32px;">${content.introduction}</p>

          <section style="margin-bottom:32px;color:#94A3B8;line-height:1.8;font-size:16px;">
            <h2 style="font-size:22px;color:#F8FAFC;margin-bottom:12px;">${content.featuresTitle}</h2>
            <p style="margin-bottom:24px;">${content.features}</p>

            <h2 style="font-size:22px;color:#F8FAFC;margin-bottom:12px;">${content.guideTitle}</h2>
            <p style="margin-bottom:24px;">${content.guide}</p>

            <h2 style="font-size:22px;color:#F8FAFC;margin-bottom:12px;">${content.benefitsTitle}</h2>
            <p>${content.benefits}</p>
          </section>

          <section style="margin-bottom:48px;">
            <h2 style="font-size:24px;font-weight:800;color:#F8FAFC;margin-bottom:24px;">
              Frequently Asked Questions (FAQ) about ${content.title}
            </h2>
            <div>
              ${faqsHtml}
            </div>
          </section>
        </main>
      </div>
    `;

    schemasArray = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": content.title,
        "operatingSystem": "Web",
        "applicationCategory": "MultimediaApplication",
        "url": canonicalUrl,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": content.faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }
    ];

  // 4. Blog detail posts: /blog/:slug
  } else if (cleanPath.startsWith("/blog/") && cleanPath !== "/blog") {
    const postSlug = cleanPath.replace("/blog/", "");
    const post = BLOG_POSTS.find(p => p.slug === postSlug || p.id === postSlug);
    if (post) {
      title = `${post.title} – ReelHooks AI Blog`;
      description = post.excerpt;

      const faqsHtml = post.faqs
        .map(faq => `
          <div style="margin-bottom:24px;background:#1E293B;padding:24px;border-radius:16px;border:1px solid rgba(255,255,255,0.1);">
            <h3 style="font-size:1.15rem;font-weight:700;color:#F8FAFC;margin-bottom:8px;margin-top:0;">${faq.q}</h3>
            <p style="color:#94A3B8;line-height:1.6;margin:0;">${faq.a}</p>
          </div>
        `)
        .join("\n");

      bodyContent = `
        <div style="font-family:'Inter', sans-serif;background-color:#0B0F19;color:#F8FAFC;min-height:100vh;padding:40px 20px;">
          <main style="max-width:800px;margin:40px auto;padding:0;">
            <nav style="font-size:14px;color:#94A3B8;margin-bottom:24px;text-align:left;">
              <a href="/" style="color:#6C5CE7;text-decoration:none;">Home</a> &gt; 
              <a href="/blog" style="color:#6C5CE7;text-decoration:none;">Blog</a> &gt; 
              <span style="color:#F8FAFC;">${post.title}</span>
            </nav>
            <h1 style="font-size:36px;font-weight:800;color:#6C5CE7;line-height:1.3;margin-bottom:16px;">${post.title}</h1>
            <p style="font-size:18px;color:#94A3B8;line-height:1.6;margin-bottom:32px;">${post.excerpt}</p>
            
            <div style="color:#94A3B8;line-height:1.8;font-size:16px;margin-bottom:48px;">
              ${post.content.replace(/\n/g, "<br/>")}
            </div>

            ${post.faqs.length > 0 ? `
            <section style="margin-bottom:48px;">
              <h2 style="font-size:24px;font-weight:800;color:#F8FAFC;margin-bottom:24px;">
                Frequently Asked Questions
              </h2>
              <div>
                ${faqsHtml}
              </div>
            </section>
            ` : ""}
          </main>
        </div>
      `;

      schemasArray = [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "datePublished": new Date(post.date).toISOString(),
          "dateModified": new Date(post.date).toISOString(),
          "author": {
            "@type": "Person",
            "name": post.author
          }
        }
      ];
    }
  // 5. Sitemap page: /sitemap
  } else if (cleanPath === "/sitemap") {
    title = "HTML Sitemap | Browse All Creator Tools & Viral Niche Guides";
    description = "Navigate all high-priority creator resources, AI generators, and viral niche hook pillar pages on ReelHooks.site. Find everything you need in one place.";

    const toolsLinks = [
      { path: "/tools/instagram-bio-generator", title: "AI Instagram Bio Generator (with Hinglish support)" },
      { path: "/tools/instagram-caption-generator", title: "AI Instagram Caption Generator (boost engagement)" },
      { path: "/tools/instagram-hashtag-generator", title: "AI Instagram Hashtag Generator (viral 2026 tags)" },
      { path: "/tools/instagram-reel-generator", title: "AI Instagram Reel Script Writer (full script outlines)" },
      { path: "/tools/instagram-username-generator", title: "AI Instagram Username Generator (aesthetic & unique)" },
      { path: "/tools/instagram-dp-generator", title: "AI Instagram Profile Picture (DP) Maker" },
      { path: "/tools/instagram-transcript-generator", title: "AI Instagram Transcript Generator (video to text)" },
      { path: "/tools/instagram-mockup-generator", title: "AI Instagram Feed & Post Mockup Planner" },
      { path: "/tools/hook-generator", title: "Free AI Hook Generator & Hook Formulas" }
    ].map(t => `<li style="margin-bottom:12px;"><a href="${t.path}" style="color:#6C5CE7;text-decoration:none;font-weight:600;">${t.title}</a></li>`).join("\n");

    const nicheLinks = NICHES.map(n => 
      `<div style="margin-bottom:12px;"><a href="/hooks/${n.id.toLowerCase()}" style="color:#6C5CE7;text-decoration:none;font-weight:600;">${n.name} Reel Hooks Pillar Guide</a></div>`
    ).join("\n");

    const articleLinks = [
      "best-hooks-for-instagram-reels",
      "viral-hooks-for-instagram-reels",
      "how-to-go-viral-on-reels-2026",
      "best-time-to-post-reels-india",
      "how-to-get-first-1000-followers-instagram",
      "instagram-algorithm-explained-2026",
      "how-to-use-ai-for-content-creation",
      "monetize-instagram-reels-india",
      "increase-reel-engagement-hacks",
      "faceless-reel-channel-guide",
      "instagram-seo-tips-for-creators",
      "reel-hook-analyzer",
      "content-ideas-generator",
      "content-calendar-generator",
      "free-ai-hook-generator"
    ].map(slug => {
      const art = SEO_ARTICLES[slug];
      const name = art ? (art.metaTitle || art.title) : slug.replace(/-/g, ' ');
      return `<div style="margin-bottom:12px;"><a href="/${slug}" style="color:#6C5CE7;text-decoration:none;font-weight:600;">${name}</a></div>`;
    }).join("\n");

    bodyContent = `
      <div style="font-family:'Inter', sans-serif;background-color:#0B0F19;color:#F8FAFC;min-height:100vh;padding:60px 20px;">
        <main style="max-width:900px;margin:40px auto;padding:0;">
          <h1 style="font-size:38px;font-weight:800;color:#6C5CE7;margin-bottom:12px;text-align:center;">HTML Sitemap Directory</h1>
          <p style="font-size:16px;color:#94A3B8;text-align:center;margin-bottom:48px;">Quickly browse all free creator tools, viral niche guides, and strategy resources on ReelHooks.site.</p>
          
          <div style="display:grid;grid-template-columns:1fr;gap:40px;margin-bottom:48px;">
            <section style="background:#131926;border:1px solid rgba(255,255,255,0.05);padding:30px;border-radius:24px;">
              <h2 style="font-size:22px;font-weight:700;color:#F8FAFC;margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:10px;">Platform Pages</h2>
              <ul style="list-style:none;padding:0;margin:0;">
                <li style="margin-bottom:12px;"><a href="/" style="color:#6C5CE7;text-decoration:none;font-weight:600;">ReelHooks.site – Free AI Hook Generator</a></li>
                <li style="margin-bottom:12px;"><a href="/explore" style="color:#6C5CE7;text-decoration:none;font-weight:600;">Explore All Categories</a></li>
                <li style="margin-bottom:12px;"><a href="/about" style="color:#6C5CE7;text-decoration:none;font-weight:600;">About ReelHooks & Murtaza Darvesh</a></li>
                <li style="margin-bottom:12px;"><a href="/faq" style="color:#6C5CE7;text-decoration:none;font-weight:600;">Frequently Asked Questions</a></li>
                <li style="margin-bottom:12px;"><a href="/contact" style="color:#6C5CE7;text-decoration:none;font-weight:600;">Contact Support Team</a></li>
                <li style="margin-bottom:12px;"><a href="/blog" style="color:#6C5CE7;text-decoration:none;font-weight:600;">Creator Strategy Blog</a></li>
              </ul>
            </section>

            <section style="background:#131926;border:1px solid rgba(255,255,255,0.05);padding:30px;border-radius:24px;">
              <h2 style="font-size:22px;font-weight:700;color:#F8FAFC;margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:10px;">Free Creator AI Tools</h2>
              <ul style="list-style:none;padding:0;margin:0;">
                ${toolsLinks}
              </ul>
            </section>

            <section style="background:#131926;border:1px solid rgba(255,255,255,0.05);padding:30px;border-radius:24px;">
              <h2 style="font-size:22px;font-weight:700;color:#F8FAFC;margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:10px;">Premium Content Growth Guides</h2>
              <div style="display:grid;grid-template-columns:1fr;gap:12px;">
                ${articleLinks}
              </div>
            </section>

            <section style="background:#131926;border:1px solid rgba(255,255,255,0.05);padding:30px;border-radius:24px;">
              <h2 style="font-size:22px;font-weight:700;color:#F8FAFC;margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:10px;">Viral Niche Pillar Guides</h2>
              <div style="display:grid;grid-template-columns:1fr;gap:12px;">
                ${nicheLinks}
              </div>
            </section>
          </div>
        </main>
      </div>
    `;
  }

  // Rewrite original HTML with replacements
  let revised = html;
  
  revised = revised.replace(/<title data-rh="true">.*?<\/title>/, `<title data-rh="true">${title}</title>`);
  revised = revised.replace(/<meta data-rh="true" name="description" content=".*?" \/>/, `<meta data-rh="true" name="description" content="${description}" />`);
  revised = revised.replace(/<link data-rh="true" rel="canonical" href=".*?" \/>/, `<link data-rh="true" rel="canonical" href="${canonicalUrl}" />`);
  revised = revised.replace(/<meta data-rh="true" property="og:title" content=".*?" \/>/, `<meta data-rh="true" property="og:title" content="${title}" />`);
  revised = revised.replace(/<meta data-rh="true" property="og:description" content=".*?" \/>/, `<meta data-rh="true" property="og:description" content="${description}" />`);
  revised = revised.replace(/<meta data-rh="true" property="og:url" content=".*?" \/>/, `<meta data-rh="true" property="og:url" content="${canonicalUrl}" />`);
  if (cleanPath === "/tdee-calculator") {
    revised = revised.replace(/<meta data-rh="true" property="og:image" content=".*?" \/>/, '<meta data-rh="true" property="og:image" content="https://www.reelhooks.site/og-tdee-calculator.svg" />');
    revised = revised.replace("</head>", '<meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="TDEE Calculator: Estimate Your Daily Calories Free" /><meta name="twitter:description" content="Estimate your TDEE, BMR and daily calorie targets with three established formulas. Choose activity, units and goals in this free calculator." /><meta name="twitter:image" content="https://www.reelhooks.site/og-tdee-calculator.svg" /></head>');
  }

  // Handle NoIndex routes (like dashboard, profile, or Tier 2 pages)
  const isNoIndex = cleanPath.startsWith("/dashboard") || cleanPath.startsWith("/profile") || !isTier1Url(cleanPath);
  if (isNoIndex) {
    revised = revised.replace(/<meta name="robots" content=".*?" \/>/, '<meta name="robots" content="noindex, follow" />');
  }

  if (bodyContent) {
    revised = revised.replace(/<div id="root">[\s\S]*?(?=\s*<script type="module" src="\/src\/main\.tsx")/, `<div id="root">${bodyContent}</div>\n    `);
  }

  if (schemasArray.length > 0) {
    const schemaScripts = schemasArray.map(schema => `
    <script type="application/ld+json">
    ${JSON.stringify(schema, null, 2)}
    </script>`).join("\n");
    revised = revised.replace("</head>", `${schemaScripts}\n</head>`);
  }

  return revised;
}

async function startServer() {

  app.use(express.json());

  // Canonical host and clean calculator URL redirects.
  app.set("trust proxy", true);
  app.use((req, res, next) => {
    const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim().toLowerCase();
    if (host === "reelhooks.site") return res.redirect(301, `https://www.reelhooks.site${req.originalUrl}`);
    if (req.path === "/tdee-calculator/") return res.redirect(301, `/tdee-calculator${req.url.slice(req.path.length)}`);
    const cleanPath = req.path.replace(/^\\/|\\/$/g, "");
    if (REDIRECT_MAP[cleanPath]) return res.redirect(301, REDIRECT_MAP[cleanPath]);
    next();
  });

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 410 Gone for /hi/ route to tell Google it's permanently removed
  app.get(["/hi", "/hi/"], (req, res) => {
    res.status(410).send("This page has been permanently removed.");
  });

  // robots.txt
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nAllow: /\nSitemap: https://www.reelhooks.site/sitemap.xml");
  });

  // sitemap.xml
  app.get("/sitemap.xml", (req, res) => {
    res.type("application/xml");
    const paths: string[] = [
      "/",
      "/explore",
      "/about",
      "/faq",
      "/contact",
      "/privacy",
      "/terms",
      "/blog",
      "/sitemap",
      "/calculators",
      "/medical-disclaimer",
      "/tdee-calculator"
    ];

    // Add blogs
    BLOG_POSTS.forEach(post => {
      paths.push(`/blog/${post.slug}`);
    });

    // Add whitelisted tools
    const whitelistedTools = [
      "instagram-bio-generator",
      "instagram-caption-generator",
      "instagram-hashtag-generator",
      "instagram-reel-generator",
      "instagram-username-generator",
      "instagram-dp-generator",
      "instagram-transcript-generator",
      "instagram-mockup-generator",
      "hook-generator"
    ];
    whitelistedTools.forEach(tool => {
      paths.push(`/tools/${tool}`);
    });

    // Add niche pillar pages and supported language variants.
    const supportedLanguages = ["english", "hindi", "hinglish", "spanish", "french"];
    NICHES.forEach(n => {
      const nicheId = n.id.toLowerCase();
      paths.push(`/hooks/${nicheId}`);
      supportedLanguages.forEach(language => {
        paths.push(`/hooks/${nicheId}-${language}`);
      });
    });

    // Add premium articles
    const premiumArticles = [
      "best-hooks-for-instagram-reels",
      "viral-hooks-for-instagram-reels",
      "how-to-go-viral-on-reels-2026",
      "best-time-to-post-reels-india",
      "how-to-get-first-1000-followers-instagram",
      "instagram-algorithm-explained-2026",
      "how-to-use-ai-for-content-creation",
      "monetize-instagram-reels-india",
      "increase-reel-engagement-hacks",
      "faceless-reel-channel-guide",
      "instagram-seo-tips-for-creators",
      "reel-hook-analyzer",
      "content-ideas-generator",
      "content-calendar-generator",
      "free-ai-hook-generator"
    ];
    premiumArticles.forEach(slug => {
      paths.push(`/${slug}`);
    });

    const urlBlocks = paths.map(p => {
      let priority = "0.7";
      if (p === "/") priority = "1.0";
      else if (p === "/explore" || p.startsWith("/tools/")) priority = "0.9";
      else if (p.startsWith("/hooks/")) priority = "0.8";
      
      return `  <url>
    <loc>https://www.reelhooks.site${p}</loc>
    <priority>${priority}</priority>
    ${p === "/tdee-calculator" || p === "/calculators" ? "<lastmod>2026-11-02</lastmod>" : ""}
  </url>`;
    }).join("\n");

    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlBlocks}
</urlset>`);
  });

  // Programmatic SEO Routes
  app.get("/api/seo/niche/:niche", (req, res) => {
    const { niche } = req.params;
    res.json({
      title: `${niche.charAt(0).toUpperCase() + niche.slice(1)} Reel Hooks - Viral Instagram Ideas`,
      description: `Get the best ${niche} reel hooks to stop scrolling and boost engagement. Free AI-powered hook generator.`,
      content: `This is SEO optimized content for ${niche} hooks...`
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
    
    // Fallback for SPA in dev mode
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      if (url.includes(".") || url.startsWith("/api/")) {
        return next();
      }
      try {
        const indexHtml = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");
        let template = await vite.transformIndexHtml(url, indexHtml);
        const finalHtml = renderSeoHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(finalHtml);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Serve static files in production with index fallback disabled
    app.use(express.static(path.join(__dirname, "dist"), { index: false }));
    
    app.get("*", (req, res) => {
      const url = req.path;
      try {
        const indexHtml = fs.readFileSync(path.join(__dirname, "dist", "index.html"), "utf-8");
        const finalHtml = renderSeoHtml(url, indexHtml);
        res.status(200).set({ "Content-Type": "text/html" }).send(finalHtml);
      } catch (e) {
        console.error("Error serving production HTML:", e);
        res.status(500).send("Internal Server Error");
      }
    });
  }

  if (!process.env.VERCEL) {
    const PORT = Number(process.env.PORT || 3000);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

await startServer();
export default app;
