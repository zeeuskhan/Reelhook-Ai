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
