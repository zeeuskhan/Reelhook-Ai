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

  // Dedicated TDEE calculator landing page: render useful HTML before React hydrates.
  } else if (cleanPath === "/tdee-calculator") {
    title = "Free TDEE Calculator: Daily Calorie Needs & BMR | ReelHooks";
    description = "Estimate your total daily energy expenditure (TDEE), resting energy needs and activity-adjusted calories with a free metric and imperial calculator. Results are estimates, not medical advice.";
    bodyContent = `
      <main style="max-width:900px;margin:40px auto;padding:24px;color:#F8FAFC;font-family:Inter,sans-serif;line-height:1.75;">
        <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>TDEE Calculator</span></nav>
        <h1 style="font-size:38px;font-weight:800;margin:28px 0 16px;">Free TDEE Calculator</h1>
        <p>Estimate your total daily energy expenditure (TDEE), the energy your body uses across an average day. The calculator supports metric and imperial measurements and explains estimated resting energy expenditure, activity assumptions and limitations.</p>
        <p><strong>How it works:</strong> It estimates resting energy expenditure using the Mifflin–St Jeor equation and applies an activity multiplier. This is a prediction, not a direct measurement of metabolism.</p>
        <h2>What you can calculate</h2><ul><li>Estimated resting energy expenditure (often labelled BMR)</li><li>Estimated daily energy expenditure based on activity</li><li>Illustrative maintenance and goal-based calorie figures</li><li>Estimated macronutrient breakdown</li></ul>
        <h2>Important limitations</h2><p>This general adult calculator is not intended to prescribe nutrition for anyone under 18, during pregnancy or breastfeeding, for eating-disorder recovery, or for medical nutrition therapy. Consult a qualified healthcare professional or registered dietitian for individual advice.</p>
        <p><a href="/blog/tdee-calculator-formula-mifflin-st-jeor-explained">Read how the TDEE formula works</a> · <a href="/blog/tdee-calculator-weight-loss-calorie-deficit-guide">Understand calorie-deficit estimates</a></p>
      </main>`;
    schemasArray = [
      { "@context": "https://schema.org", "@type": "WebApplication", "name": "Free TDEE Calculator", "url": "https://www.reelhooks.site/tdee-calculator", "applicationCategory": "HealthApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }, "description": description },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [ { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.reelhooks.site/" }, { "@type": "ListItem", "position": 2, "name": "TDEE Calculator", "item": "https://www.reelhooks.site/tdee-calculator" } ] }
    ];

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
          "datePublished": "2026-05-10T08:00:00+08:00",
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

  // Handle NoIndex routes (like dashboard, profile, or Tier 2 pages)
  const isNoIndex = cleanPath.startsWith("/dashboard") || cleanPath.startsWith("/profile") || !isTier1Url(cleanPath);
  if (isNoIndex) {
    revised = revised.replace(/<meta name="robots" content=".*?" \/>/, '<meta name="robots" content="noindex, follow" />');
  }

  if (bodyContent) {
    revised = revised.replace(/<div id="root">([\s\S]*?)<\/div>/, `<div id="root">${bodyContent}</div>`);
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

  // Redirect Middleware for Consolidated/Duplicate/Unrelated spammey URLs
  app.use((req, res, next) => {
    const cleanPath = req.path.replace(/^\/|\/$/g, ""); // strip leading/trailing slashes
    if (REDIRECT_MAP[cleanPath]) {
      return res.redirect(301, REDIRECT_MAP[cleanPath]);
    }
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
