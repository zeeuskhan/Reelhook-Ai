import { GoogleGenAI } from "@google/genai";

// Standard model for reliability and speed
const DEFAULT_MODEL = "gemini-1.5-flash";

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

export async function generateHooksAI(niche: string, sub: string, lang: string, tone: string) {
  const ai = getGenAI();
  const prompt = `You are a viral short-form content strategist. 
  Generate 10 unique, high-retention Instagram Reel hooks for the niche: ${niche} (${sub}).
  Language: ${lang}. Tone: ${tone}.
  
  Each hook must:
  - Be under 10 words.
  - Use psychological triggers (Curiosity gap, FOMO, Pattern interrupt, Bold claim).
  - Include a viral percentage score (60-98%) based on retention psychology.
  
  Return ONLY a JSON array of objects with "text" and "score" properties. No explanation.`;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    // Check if response and response.text exist
    if (!response || !response.text) {
      throw new Error("Empty response from AI");
    }

    const data = safeJsonParse(response.text);
    if (!Array.isArray(data)) return [];

    return data.map((h: any) => {
      // Handle case where h might be a string
      const text = typeof h === 'string' ? h : h.text || h.hook || "";
      const scoreRaw = typeof h === 'string' ? 85 : h.score;
      const scoreByNum = typeof scoreRaw === 'string' ? parseInt(scoreRaw) : scoreRaw;
      const score = Number(scoreByNum) || 85;

      return {
        id: Math.random().toString(36).substr(2, 9),
        text,
        score,
        category: score >= 90 ? "High Viral Potential" : score >= 75 ? "Strong Hook" : "Needs Improvement"
      };
    }).filter(h => h.text.length > 0);
  } catch (error) {
    console.error("AI Generation Error (Hooks):", error);
    return [];
  }
}

export async function generateExtraAI(type: string, context: string) {
  const ai = getGenAI();
  let prompt = "";
  
  switch(type) {
    case "caption":
      prompt = `Generate 3 Instagram Reel captions for this hook: "${context}". Include: 1 short, 1 storytelling, 1 CTA style. Use emojis. Return JSON: { captions: string[] }`;
      break;
    case "hashtags":
      prompt = `Generate 15 optimized hashtags for this hook: "${context}". Mix high reach, medium competition, and niche-specific. Return JSON: { hashtags: string[] }`;
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
      config: { responseMimeType: "application/json" }
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
    
    return data;
  } catch (error) {
    console.error("AI Generation Error (Extra):", error);
    return {};
  }
}
