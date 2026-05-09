import { GoogleGenAI } from "@google/genai";

// Standard model for reliability and speed
const DEFAULT_MODEL = "gemini-3-flash-preview";

// Lazy initialization to avoid crashing if key is missing at load time
let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. AI features will not work.");
      // We don't throw here to avoid crashing the whole app, 
      // but the calls will fail gracefully later.
    }
    genAI = new GoogleGenAI({ apiKey: apiKey || "" });
  }
  return genAI;
}

export function safeJsonParse(text: string, fallback: any = []) {
  if (!text) return fallback;
  try {
    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?|```/g, "").trim();
    if (!cleanText) return fallback;
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error:", e, "Original text:", text);
    // Attempt to extract array or object if JSON.parse fails
    try {
      const match = text.match(/\[.*\]|\{.*\}/s);
      if (match) return JSON.parse(match[0]);
    } catch (innerE) {
      console.error("Nested JSON Parse Error:", innerE);
    }
    return fallback;
  }
}

// Emergency fallback hooks if AI fails completely
const FALLBACK_HOOK_TEMPLATES = [
  "The secret to {niche} that experts don't want you to know...",
  "Stop doing {niche} like this if you want actual results.",
  "I wish I knew this about {niche} when I first started.",
  "3 simple {niche} mistakes that are costing you views.",
  "How I achieved {result} in {niche} in just 30 days (steppable).",
  "This is why your {niche} strategies aren't working anymore.",
  "The only {niche} guide you will ever need to watch.",
  "I tried every viral {niche} hack so you don't have to.",
  "One tiny change that doubled my {niche} results overnight.",
  "Steal my exact {niche} routine for maximum growth."
];

export async function generateHooksAI(niche: string, sub: string, lang: string, tone: string) {
  const ai = getGenAI();
  const prompt = `You are a world-class viral short-form content strategist specialized in Instagram Reels, TikTok, and YouTube Shorts. 
  Your task is to generate 10 unique, high-retention scroll-stopping hooks for the following niche:
  
  NICHE: ${niche}
  SUB-CATEGORY: ${sub}
  LANGUAGE: ${lang}
  TONE: ${tone}
  
  STRATEGY GUIDELINES:
  - Each hook MUST be optimized for the first 3 seconds of a video.
  - Mix different psychological triggers: Curiosity Gap, Fear Of Missing Out (FOMO), Negative Constraint, Bold Promise, Quick-Win.
  - The hook should feel organic and native to ${lang} speakers.
  - Length: 5-12 words.
  
  OUTPUT FORMAT:
  Return ONLY a valid JSON array of objects. Example:
  [{"text": "Hook text here", "score": 95}, ...]
  
  Do not include any intro, outro, or explanation.`;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        temperature: 0.8
      }
    });
    
    if (!response || !response.text) {
      throw new Error("Empty response from AI");
    }

    let data = safeJsonParse(response.text);
    
    // If the AI returns a single object instead of an array, wrap it
    if (!Array.isArray(data)) {
        if (typeof data === 'object' && data !== null) {
            data = [data];
        } else {
            data = [];
        }
    }

    if (data.length === 0) {
      console.warn("AI returned empty array, triggering template fallback.");
      return FALLBACK_HOOK_TEMPLATES.map(t => ({
        id: Math.random().toString(36).substr(2, 9),
        text: t.replace(/{niche}/g, niche).replace(/{result}/g, "success"),
        score: Math.floor(Math.random() * (98 - 85 + 1) + 85),
        category: "Strong Hook"
      }));
    }

    return data.map((h: any) => {
      const text = typeof h === 'string' ? h : h.text || h.hook || h.title || "";
      const scoreRaw = typeof h === 'string' ? 85 : h.score;
      const scoreByNum = typeof scoreRaw === 'string' ? parseInt(scoreRaw) : scoreRaw;
      const score = Number(scoreByNum) || 85;

      return {
        id: Math.random().toString(36).substr(2, 9),
        text,
        score,
        category: score >= 90 ? "High Viral Potential" : score >= 75 ? "Strong Hook" : "Needs Improvement"
      };
    }).filter(h => h.text && h.text.length > 5);
  } catch (error) {
    console.error("AI Generation Error (Hooks):", error);
    // Return hardcoded templates as a final safety net
    return FALLBACK_HOOK_TEMPLATES.map(t => ({
        id: Math.random().toString(36).substr(2, 9),
        text: t.replace(/{niche}/g, niche).replace(/{result}/g, "success"),
        score: Math.floor(Math.random() * (98 - 85 + 1) + 85),
        category: "Strong Hook (Fallback)"
    }));
  }
}

export async function generateExtraAI(type: string, context: string, options: any = {}) {
  const ai = getGenAI();
  let prompt = "";
  
  switch(type) {
    case "caption":
      const tone = options.tone || "Viral";
      prompt = `Generate 5 structured Instagram/TikTok captions for this topic: "${context}". Tone: ${tone}. 
      Include: 
      1. Short and snappy
      2. Emotional story
      3. Funny/Relatable
      4. Hard CTA focused
      5. Educational/Value.
      Use emojis. Format as JSON: { captions: string[] }`;
      break;
    case "hashtags":
      prompt = `Generate 30 optimized hashtags for the topic: "${context}". Group them by reach/type. 
      Format as JSON: { categories: { name: string, tags: string[] }[] }`;
      break;
    case "script":
      prompt = `Generate a 30-second Reel script for this hook: "${context}". Include talking points and a strong closing CTA. Return JSON: { script: string }`;
      break;
    case "ideas":
      prompt = `Generate 10 trending Reel ideas for the niche: "${context}". Include emotional trigger and difficulty level. Return JSON: { ideas: { title: string, trigger: string, difficulty: string }[] }`;
      break;
    case "improve":
      prompt = `Improve this hook: "${context}". Provide 5 viral variations with scores. Return JSON: { variations: { text: string, score: number }[] }`;
      break;
    case "analyze":
      prompt = `Analyze this hook: "${context}". Provide viral potential score (0-100), explanation, psychological trigger used, and curiosity gap strength. Return JSON: { score: number, explanation: string, trigger: string, gapStrength: string }`;
      break;
    case "angle":
      prompt = `Generate 5 different content angles for the topic: "${context}". Include title, description, and a sample hook for each. Return JSON: { angles: { title: string, description: string, hook: string }[] }`;
      break;
    case "time":
      prompt = `Suggest the best posting time and day for the niche: "${context}". Include bestDay, bestTime, and a strategy tip. Return JSON: { bestDay: string, bestTime: string, strategy: string }`;
      break;
    case "calendar":
      prompt = `Generate a 7-day viral content roadmap for the niche: "${context}". Include topic and hookType for each day. Return JSON: { plan: { topic: string, hookType: string }[] }`;
      break;
    case "bio":
      prompt = `Generate 5 viral Instagram bios for this niche/description: "${context}". Use emojis, include a CTA, and keep it under 150 chars. Return JSON: { bios: string[] }`;
      break;
    case "username":
      prompt = `Generate 10 catchy and unique Instagram usernames for: "${context}". Avoid excessive numbers/underscores. Return JSON: { usernames: string[] }`;
      break;
    case "dp":
      prompt = `Suggest 5 creative profile picture (DP) ideas or AI prompts for: "${context}". Return JSON: { ideas: string[] }`;
      break;
    case "transcript":
      prompt = `Clean up and summarize this video transcript: "${context}". Return JSON: { summary: string, cleanText: string }`;
      break;
    default:
      prompt = `Help me with this Instagram content task: "${context}". Return JSON: { result: string }`;
  }

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });
    
    if (!response || !response.text) {
      throw new Error("Empty response from AI");
    }

    const data = safeJsonParse(response.text, {});
    
    // Defensive property normalization
    if (data.variations && Array.isArray(data.variations)) {
      data.variations = data.variations.map((v: any) => ({
        ...v,
        score: typeof v.score === 'string' ? parseInt(v.score) : Number(v.score) || 85
      }));
    }
    if (data.score !== undefined) {
      data.score = typeof data.score === 'string' ? parseInt(data.score) : Number(data.score) || 0;
    }
    
    // Check if result is empty and return a minimal fallback object
    if (Object.keys(data).length === 0) {
       return {
         captions: ["Viral caption here...", "Check this out!", "Don't miss out on this trend."],
         categories: [{ name: "Trending", tags: ["viral", "trending", "reels", context.split(" ")[0]] }],
         script: `Intriguing hook: ${context}\nMiddle: Share value...\nEnd: Call to action.`,
         ideas: [{ title: `${context} Tutorial`, trigger: "Education", difficulty: "Easy" }]
       };
    }

    return data;
  } catch (error) {
    console.error("AI Generation Error (Extra):", error);
    return {
        captions: ["Viral caption here...", "Check this out!", "Don't miss out on this trend."],
        categories: [{ name: "Fallback", tags: ["viral", "trending", "reels", "shorts"] }],
        script: `Intriguing hook: ${context}\nMiddle: Share value...\nEnd: Call to action.`,
        ideas: [{ title: `${context} Tips`, trigger: "Value", difficulty: "Medium" }]
    };
  }
}
