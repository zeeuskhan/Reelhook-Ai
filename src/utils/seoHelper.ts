/**
 * SEO helpers for ReelHooks.
 *
 * Keep metadata descriptive and based on the actual page content. Do not append
 * fabricated certifications, unrelated niche terms, or keyword-stuffed suffixes.
 */

export function detectLanguage(text: string): string {
  const value = text.toLowerCase();

  if (/[\u0900-\u097f]/.test(text)) return "Hindi";
  if (/\b(hinglish|behtareen|kaise|karo|bhai)\b/.test(value)) return "Hinglish";
  if (/\b(spanish|español|espanol)\b/.test(value)) return "Spanish";
  if (/\b(french|français|francais)\b/.test(value)) return "French";
  if (/\b(hindi)\b/.test(value)) return "Hindi";

  return "English";
}

export function detectNiche(text: string): string {
  const value = text.toLowerCase();

  if (/\b(fitness|gym|workout)\b/.test(value)) return "Fitness";
  if (/\b(finance|money|investing|crypto)\b/.test(value)) return "Finance";
  if (/\b(beauty|skincare|makeup)\b/.test(value)) return "Beauty";
  if (/\b(parenting|toddler|family)\b/.test(value)) return "Parenting";
  if (/\b(travel|tourism|vlog)\b/.test(value)) return "Travel";
  if (/\b(food|cooking|recipe)\b/.test(value)) return "Food";
  if (/\b(education|learning|study)\b/.test(value)) return "Education";
  if (/\b(business|marketing|entrepreneur)\b/.test(value)) return "Business";
  if (/\b(technology|tech|software|gadget|ai)\b/.test(value)) return "Technology";
  if (/\b(reel|instagram|tiktok|youtube|shorts|creator|hook)\b/.test(value)) {
    return "Social media content creation";
  }

  return "Content creation";
}

/**
 * Return the editor-written description without adding invented claims.
 * The page author is responsible for making each description genuinely unique.
 */
export function getEnhancedMetaDescription(
  _slug: string,
  _title: string,
  originalDesc: string,
  _keywords: string[] = [],
  _h1: string = ""
): string {
  return originalDesc.trim().replace(/\s+/g, " ");
}

/** Normalize the supplied page title without injecting unrelated keywords. */
export function getEnhancedMetaTitle(title: string, _slug: string): string {
  return title
    .trim()
    .replace(/\s*[|–-]\s*ReelHooks\.site\s*$/i, "");
}

/** Keep visible article headings faithful to the authored title. */
export function getHumanFriendlyTitle(title: string, _slug: string): string {
  return title.trim().replace(/^Guide:\s*/i, "");
}

/**
 * Do not rewrite article prose or inject keyword links automatically.
 * Internal links should be editorially selected and point to relevant pages.
 */
export function enhanceArticleContentAndInterlink(
  htmlContent: string,
  _currentSlug: string
): string {
  return htmlContent;
}
