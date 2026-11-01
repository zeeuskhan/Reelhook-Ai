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

/**
 * Keep metadata descriptive and human-readable. Do not append artificial
 * keyword strings or unsupported authority claims to force uniqueness.
 */
export function detectNiche(text: string): string {
  const value = text.toLowerCase();
  if (/instagram|reel|shorts|tiktok|creator|hook/.test(value)) return "Social Media & Video Creation";
  if (/fitness|gym|workout|health/.test(value)) return "Fitness & Wellness";
  if (/finance|money|investing|business/.test(value)) return "Business & Finance";
  if (/tech|gadget|software|ai tool/.test(value)) return "Technology";
  if (/beauty|skincare|makeup/.test(value)) return "Beauty";
  if (/parenting|toddler|family/.test(value)) return "Parenting";
  return "Digital Content Creation";
}

export function getEnhancedMetaDescription(
  _slug: string,
  _title: string,
  originalDesc: string,
  _keywords: string[] = [],
  _h1: string = ""
): string {
  const cleaned = originalDesc.replace(/\\s+/g, " ").trim();
  if (cleaned.length <= 160) return cleaned;
  const shortened = cleaned.slice(0, 157);
  const lastSpace = shortened.lastIndexOf(" ");
  return (lastSpace > 110 ? shortened.slice(0, lastSpace) : shortened).replace(/[ ,;:.-]+$/, "") + "...";
}

export function getEnhancedMetaTitle(title: string, _slug: string): string {
  return title.trim().replace(/\\s+/g, " ");
}

export function getHumanFriendlyTitle(title: string, _slug: string): string {
  return title.trim().replace(/^Guide:\\s*/i, "");
}

/**
 * Add a small number of contextual links to existing creator resources only.
 * Legacy restaurant, fishing and unrelated URLs are intentionally excluded.
 */
export function enhanceArticleContentAndInterlink(htmlContent: string, currentSlug: string): string {
  const linkMappings = [
    { slug: "best-hooks-for-instagram-reels", keywords: ["best hooks for instagram reels", "instagram reel hooks"] },
    { slug: "how-to-go-viral-on-reels-2026", keywords: ["how to go viral on reels", "grow on reels"] },
    { slug: "best-time-to-post-reels-india", keywords: ["best time to post reels", "posting time for reels"] },
    { slug: "instagram-seo-tips-for-creators", keywords: ["instagram seo", "instagram search optimization"] },
    { slug: "free-ai-hook-generator", keywords: ["free ai hook generator", "ai hook generator"] },
    { slug: "reel-ideas-generator", keywords: ["reel ideas generator", "reels ideas"] },
    { slug: "instagram-caption-generator-free", keywords: ["instagram caption generator", "reel caption generator"] },
    { slug: "instagram-hashtag-generator-2026", keywords: ["instagram hashtag generator", "reels hashtags"] },
    { slug: "viral-reel-script-writer-with-hooks", keywords: ["reel script writer", "reel script"] },
    { slug: "faceless-reel-hooks-generator", keywords: ["faceless reel hooks", "faceless reels"] }
  ];

  const parts = htmlContent.split(/(<[^>]+>)/g);
  const linked = new Set<string>();
  let count = 0;
  let skipTag = "";

  for (let i = 0; i < parts.length; i++) {
    const token = parts[i];
    if (token.startsWith("<")) {
      const tagMatch = token.match(/^<\\s*(\\/?)(a|script|style)\\b/i);
      if (tagMatch) {
        const tag = tagMatch[2].toLowerCase();
        if (tagMatch[1] === "/") skipTag = "";
        else if (!token.endsWith("/>")) skipTag = tag;
      }
      continue;
    }
    if (skipTag || count >= 6) continue;

    let text = token;
    for (const mapping of linkMappings) {
      if (mapping.slug === currentSlug || linked.has(mapping.slug) || count >= 6) continue;
      const keyword = mapping.keywords.find((candidate) => new RegExp("\\\\b" + candidate.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&") + "\\\\b", "i").test(text));
      if (!keyword) continue;
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&");
      text = text.replace(new RegExp("\\\\b(" + escapedKeyword + ")\\\\b", "i"), '<a href="/' + mapping.slug + '" class="text-primary hover:underline font-semibold">$1</a>');
      linked.add(mapping.slug);
      count++;
    }
    parts[i] = text;
  }

  return parts.join("");
}
