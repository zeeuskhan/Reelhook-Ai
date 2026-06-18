/**
 * Dynamic SEO Helper Utility
 * Programmatically generates unique, high-performance meta descriptions and titles
 * to eliminate duplicate content issues and adapt to the specific niche and language.
 */

export function detectLanguage(text: string): string {
  const textLower = text.toLowerCase();
  
  if (
    textLower.includes("क्या") || 
    textLower.includes("बेहतरीन") || 
    textLower.includes("वीडियो") || 
    textLower.includes("हुक्स") ||
    textLower.includes("बढ़ाएं")
  ) {
    return "Hindi (Devanagari)";
  }
  
  if (
    textLower.includes("hindi") || 
    textLower.includes("behtareen") || 
    textLower.includes("kaise") || 
    textLower.includes("karo") ||
    textLower.includes("itna")
  ) {
    return "Hindi (Latin)";
  }
  
  if (
    textLower.includes("hinglish") || 
    textLower.includes("bhai") || 
    textLower.includes("apne") || 
    textLower.includes("laga") || 
    textLower.includes("samajhta") ||
    textLower.includes("aag")
  ) {
    return "Hinglish (Colloquial)";
  }
  
  if (textLower.includes("spanish") || textLower.includes("español") || textLower.includes("espanol")) {
    return "Spanish";
  }
  
  if (textLower.includes("french") || textLower.includes("français") || textLower.includes("francais")) {
    return "French";
  }
  
  return "English";
}

export function detectNiche(text: string): string {
  const textLower = text.toLowerCase();
  
  // Restaurant / Seafood
  if (
    textLower.includes("seafood") || 
    textLower.includes("crab") || 
    textLower.includes("menu") || 
    textLower.includes("restaurant") || 
    textLower.includes("cajun") ||
    textLower.includes("crawfish") ||
    textLower.includes("beignet") ||
    textLower.includes("calories")
  ) {
    if (textLower.includes("el paso")) return "Cajun Seafood (El Paso Branch)";
    if (textLower.includes("killeen")) return "Cajun Seafood (Killeen Branch)";
    if (textLower.includes("linden")) return "Cajun Seafood (Linden Branch)";
    if (textLower.includes("overland park")) return "Cajun Seafood (Overland Park Branch)";
    if (textLower.includes("austin")) return "Cajun Seafood (Austin Branch)";
    if (textLower.includes("middletown")) return "Cajun Seafood (Middletown Branch)";
    if (textLower.includes("wichita")) return "Cajun Seafood (Wichita Branch)";
    if (textLower.includes("sacramento")) return "Cajun Seafood (Sacramento Branch)";
    return "Cajun Seafood Dining";
  }
  
  // Marine Equipment
  if (
    textLower.includes("fishing") || 
    textLower.includes("hooker") || 
    textLower.includes("80wa") || 
    textLower.includes("motor") ||
    textLower.includes("deep-drop") ||
    textLower.includes("swordfish")
  ) {
    return "Ocean Sportfishing & Advanced Marine Gear";
  }
  
  // Creator Tools & Social Media
  if (textLower.includes("hook generator") || textLower.includes("instagram hook") || textLower.includes("reels hook") || textLower.includes("viral hooks")) {
    return "Social Media & Video Creator Strategy";
  }
  
  if (textLower.includes("fitness") || textLower.includes("gym") || textLower.includes("workout") || textLower.includes("health")) {
    return "Fitness & Bodybuilding Motivation";
  }
  
  if (textLower.includes("finance") || textLower.includes("money") || textLower.includes("investing") || textLower.includes("business")) {
    return "Finance, Investing & Corporate Growth";
  }
  
  if (textLower.includes("tech") || textLower.includes("gadget") || textLower.includes("software") || textLower.includes("ai tool")) {
    return "Tech Reviews & Artificial Intelligence Technology";
  }
  
  if (textLower.includes("beauty") || textLower.includes("skincare") || textLower.includes("makeup")) {
    return "Beauty, Makeup & Skincare Influencers";
  }
  
  if (textLower.includes("parenting") || textLower.includes("toddler") || textLower.includes("mom") || textLower.includes("dad")) {
    return "Parenting & Family Content Creators";
  }
  
  if (textLower.includes("photography") || textLower.includes("camera") || textLower.includes("lighting")) {
    return "Photography & Cinematography Techniques";
  }
  
  return "Digital Content Creation & Engagement";
}

/**
 * Enhances a meta description with specialized niche and language indicators 
 * to guarantee there are NO duplicate meta description tags across the domain.
 */
export function getEnhancedMetaDescription(
  slug: string,
  title: string,
  originalDesc: string,
  keywords: string[] = [],
  h1: string = ""
): string {
  const combinedText = `${slug} ${title} ${originalDesc} ${keywords.join(" ")} ${h1}`;
  const lang = detectLanguage(combinedText);
  const niche = detectNiche(combinedText);
  
  let cleanedBase = originalDesc.trim();
  if (cleanedBase.endsWith(".")) {
    cleanedBase = cleanedBase.slice(0, -1);
  }
  
  // Append precise unique signals for the search scraper
  const suffix = ` Certified for the ${niche} domain, crafted in ${lang}. Find custom script assets on ReelHooks.`;
  const result = `${cleanedBase}.${suffix}`;
  
  // Keep it safely around 155-165 characters if possible, or up to 180 (Google allows up to ~960px width)
  if (result.length > 180) {
    const maxBaseLength = 180 - suffix.length - 3;
    if (maxBaseLength > 30) {
      return `${cleanedBase.substring(0, maxBaseLength)}...${suffix}`;
    }
  }
  
  return result;
}

/**
 * Enhances a meta title dynamically to make sure headers are unique and context-enriched.
 */
export function getEnhancedMetaTitle(title: string, slug: string): string {
  const lang = detectLanguage(`${title} ${slug}`);
  let cleanTitle = title.trim();
  
  // If the title already ends with our site name or specific year, we can enhance it nicely.
  if (cleanTitle.toLowerCase().includes("reelhooks.site")) {
    cleanTitle = cleanTitle.replace(/ \| ReelHooks\.site/gi, "").replace(/ - ReelHooks\.site/gi, "");
  }
  
  if (lang !== "English" && !cleanTitle.includes(`(${lang})`)) {
    return `${cleanTitle} (${lang})`;
  }
  
  return cleanTitle;
}

/**
 * Optimizes titles to be highly human-friendly, warm, and click-worthy, while keeping keywords intact.
 */
export function getHumanFriendlyTitle(title: string, slug: string): string {
  let clean = title.trim();
  // Remove clinical separators or prefixes
  clean = clean.replace(/^Guide: /i, "");
  
  // Make it sound human-written, warm, and highly engaging
  if (slug.includes("seafood") || slug.includes("menu")) {
    if (!clean.includes("🔥") && !clean.includes("🦀")) {
      clean = `Cracking Open: ${clean} 🦀`;
    }
  } else if (slug.includes("fishing") || slug.includes("reel")) {
    if (!clean.includes("🎣")) {
      clean = `Offshore Hunt: ${clean} 🎣`;
    }
  } else {
    if (!clean.includes("🚀") && !clean.includes("✨") && !clean.includes("🔥")) {
      clean = `Viral Blueprint: ${clean} 🚀`;
    }
  }
  
  return clean;
}

/**
 * Programmatically refines HTML content to:
 * 1. Inject natural, non-intrusive internal anchor links based on targeted keyword boundaries.
 * 2. Improve the paragraph tone to sound highly human-friendly, relatable, and authentic.
 * 3. Preserve any explicit search keywords.
 */
export function enhanceArticleContentAndInterlink(htmlContent: string, currentSlug: string): string {
  let updatedHtml = htmlContent;

  // Let's refine the tone of each paragraph to ensure a highly conversational, authentic voice.
  // We replace typical dry/clinical terms with enthusiastic, creator-focused natural phrases.
  const toneReplacements = [
    { target: /this guide provides/gi, repl: "we're absolutely thrilled to present this guide with" },
    { target: /in this article, we/gi, repl: "in this friendly breakdown, you and I are going to" },
    { target: /it is critical to/gi, repl: "let's be real—it is absolutely vital to" },
    { target: /designed to help you/gi, repl: "meticulously crafted to help you easily" },
    { target: /this process involves/gi, repl: "here is how this simple, friendly process unfolds" },
    { target: /the following tables illustrate/gi, repl: "let's walk through these clean, easy-to-read tables together" },
    { target: /specifications are detailed below/gi, repl: "let's check out these amazing mechanical specs and highlights below" },
    { target: /we will explain how to/gi, repl: "we are going to break down exactly how you can" },
    { target: /uniquely positioned to/gi, repl: "perfectly tuned to seamlessly" },
    { target: /offers unprecedented precision/gi, repl: "renders highly accurate, ready-to-use outcomes" },
    { target: /it has been shown that/gi, repl: "as seasoned creators always recommend," },
    { target: /our database tracks/gi, repl: "our awesome free tool effortlessly organizes" },
  ];

  for (const { target, repl } of toneReplacements) {
    updatedHtml = updatedHtml.replace(target, repl);
  }

  // Define keyword anchor target mappings for organic interlinking
  const linkMappings = [
    {
      slug: "hook-and-reel-menu",
      keywords: ["hook and reel menu", "hook & reel menu", "official hook n reel menu", "hook n reel menu"],
    },
    {
      slug: "hook-reel-cajun-seafood-bar-killeen-menu",
      keywords: ["killeen menu", "killeen branch", "killeen tx", "hook & reel killeen"],
    },
    {
      slug: "hook-reel-cajun-seafood-bar-el-paso-menu",
      keywords: ["el paso menu", "el paso branch", "el paso tx", "hook & reel el paso"],
    },
    {
      slug: "hook-and-reel-linden",
      keywords: ["linden nj", "linden menu", "linden branch", "linden new jersey"],
    },
    {
      slug: "hook-reel-cajun-seafood-bar-overland-park-menu",
      keywords: ["overland park menu", "overland park beach", "overland park branch", "overland park cajun"],
    },
    {
      slug: "hook-reel-cajun-seafood-bar-austin-menu",
      keywords: ["austin menu", "austin branch", "austin crawfish", "austin texas"],
    },
    {
      slug: "hook-reel-cajun-seafood-bar-middletown-menu",
      keywords: ["middletown menu", "middletown branch", "middletown ny", "middletown new york"],
    },
    {
      slug: "hook-reel-cajun-seafood-bar-wichita-menu",
      keywords: ["wichita menu", "wichita branch", "wichita kansas", "wichita ks"],
    },
    {
      slug: "hook-and-reel-cajun-seafood-and-bar-sacramento-menu",
      keywords: ["sacramento menu", "sacramento branch", "sacramento california", "sacramento ca"],
    },
    {
      slug: "hooker-electric-80wa-fishing-reel",
      keywords: ["hooker electric reels", "hooker electric fishing reel", "hooker electric 80wa", "hooker electric reel"],
    },
    {
      slug: "hook-and-reel-gift-cards-promo-codes-calories",
      keywords: ["hook and reel gift card", "crab bites hook and reel", "hook and reel calories", "hook and reel dessert"],
    },
    {
      slug: "viral-reel-hooks",
      keywords: ["viral reel hooks", "viral strategy guide"],
    },
    {
      slug: "instagram-reel-hooks",
      keywords: ["instagram hook ideas", "instagram reels hook"],
    },
    {
      slug: "reel-hook-examples",
      keywords: ["50+ hook examples", "reel hook examples"],
    },
    {
      slug: "reel-hooks-hindi",
      keywords: ["best reel hooks in hindi", "reel hooks in hindi"],
    },
    {
      slug: "free-ai-hook-generator",
      keywords: ["free ai hook generator", "ai hook generator", "ai reel hook generator"],
    },
    {
      slug: "reel-ideas-generator",
      keywords: ["reel ideas generator", "reels ideas generator"],
    },
    {
      slug: "instagram-caption-generator-free",
      keywords: ["instagram caption generator", "caption generator free"],
    },
    {
      slug: "instagram-hashtag-generator-2026",
      keywords: ["instagram hashtag generator", "hashtag generator"],
    },
    {
      slug: "viral-reel-script-writer-with-hooks",
      keywords: ["viral reel script writer", "reel script writer"],
    },
    {
      slug: "faceless-reel-hooks-generator",
      keywords: ["faceless reel hooks generator", "faceless reel hooks"],
    },
    {
      slug: "trending-reel-ideas-2026",
      keywords: ["trending reel ideas", "reel ideas 2026"],
    },
    {
      slug: "best-time-to-post-reels-india",
      keywords: ["best time to post reels in india", "best time to post reels"],
    },
    {
      slug: "how-to-go-viral-on-reels-2026",
      keywords: ["how to go viral on reels", "go viral on reels"],
    },
    {
      slug: "instagram-seo-tips-for-creators",
      keywords: ["instagram seo tips", "instagram seo"],
    }
  ];

  const parts = updatedHtml.split(/(<[^>]+>)/g);
  let linkedCount = 0;
  const alreadyLinkedSlugs = new Set<string>();

  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith("<")) {
      if (parts[i].toLowerCase().startsWith("<a")) {
        while (i < parts.length && !parts[i].toLowerCase().endsWith("</a>")) {
          i++;
        }
      }
      continue;
    }

    let text = parts[i];
    
    for (const mapping of linkMappings) {
      if (mapping.slug === currentSlug) continue;
      if (alreadyLinkedSlugs.has(mapping.slug)) continue;
      if (linkedCount >= 10) break;

      for (const kw of mapping.keywords) {
        // Match clean word boundaries securely (using ignore case and handling simple variations)
        const regex = new RegExp(`\\b(${kw})\\b`, "i");
        if (regex.test(text)) {
          text = text.replace(regex, `<a href="/${mapping.slug}" class="text-primary hover:underline font-semibold">$1</a>`);
          alreadyLinkedSlugs.add(mapping.slug);
          linkedCount++;
          break;
        }
      }
    }
    parts[i] = text;
  }

  return parts.join("");
}
