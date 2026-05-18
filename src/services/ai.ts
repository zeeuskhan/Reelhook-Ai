import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Resilience Utility: Retry with exponential backoff
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    console.warn(`AI request failed, retrying in ${delay}ms... (${retries} left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

// Fallback Templates for 2026 Viral Psychology
const FALLBACK_HOOKS: Record<string, any[]> = {
  dynamic: [
    { text: "The secret 2026 algorithm hack nobody told you...", score: 94 },
    { text: "Why your last 3 Reels actually failed (Hard Truth)", score: 88 },
    { text: "Stop scrolling if you want to grow in 24 hours...", score: 91 },
    { text: "The exact strategy I used to gain 10k followers...", score: 96 },
    { text: "POV: You finally stopped overthinking your content.", score: 85 }
  ],
  finance: [
    { text: "How to save $1,000 this month without trying...", score: 92 },
    { text: "The 2026 investment strategy for beginners...", score: 90 }
  ],
  ai: [
    { text: "The only 3 AI tools you'll ever need in 2026...", score: 97 },
    { text: "How I automated my entire life with these AI tools...", score: 94 }
  ]
};

export function safeJsonParse(text: string, fallback: any = []) {
  try {
    // Aggressive cleaning for AI response artifacts
    let cleanText = text.replace(/```json\n?|```/g, "").trim();
    // Fix potential trailing commas in JSON arrays/objects
    cleanText = cleanText.replace(/,\s*([\]}])/g, "$1");
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Critical JSON Parse Error:", e, "Original text snippet:", text.substring(0, 50));
    return fallback;
  }
}

export async function generateHooksAI(niche: string, sub: string, lang: string, tone: string) {
  const model = "gemini-3-flash-preview";
  
  // Custom language instructions for high accuracy
  const langContext = lang.toLowerCase() === "hinglish" 
    ? "Mix Hindi and English naturally (Hinglish) as used by top Indian creators. Use Devanagari script for Hindi words if appropriate, or Romanized Hindi."
    : `Write exclusively in ${lang}.`;

  const prompt = `CRITICAL: You MUST generate content specifically for:
  NICHE: ${niche}
  SUB-NICHE: ${sub}
  LANGUAGE: ${lang} (${langContext})
  TONE: ${tone}
  
  Generate 10 unique, high-retention Instagram Reel hooks.
  
  Each hook must:
  - Strictly be under 10 words.
  - Use psychological triggers (Curiosity gap, FOMO, Pattern interrupt, Bold claim).
  - Match the ${tone} tone perfectly.
  - Be culturally relevant to the ${lang} audience.
  - Include a viral percentage score (60-98%) based on retention psychology.`;

  const fetchAI = async () => {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: { 
        systemInstruction: `You are an expert ${niche} content strategist. You specialize in viral hooks for the ${lang} market with a ${tone} personality. Your goal is to maximize 'Scroll-Stop' probability. Return ONLY a JSON array.`,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              score: { type: Type.NUMBER }
            },
            required: ["text", "score"]
          }
        }
      }
    });

    if (!response.text) throw new Error("Empty AI Response");
    return safeJsonParse(response.text, []);
  };

  try {
    const data = await withRetry(fetchAI);
    
    if (!data || data.length === 0) throw new Error("No data parsed");

    return data.map((h: any) => {
      const score = Math.min(100, Math.max(0, h.score || 70));
      return {
        id: Math.random().toString(36).substr(2, 9),
        text: h.text || "Viral hook incoming...",
        score: score,
        category: score >= 90 ? "High Viral Potential" : score >= 75 ? "Strong Hook" : "Needs Improvement"
      };
    });
  } catch (error) {
    console.error("AI Hooks Fatal Error, using fallback:", error);
    // Determine niche-specific fallback
    const key = niche.toLowerCase() as keyof typeof FALLBACK_HOOKS;
    const fallbackBase = FALLBACK_HOOKS[key] || FALLBACK_HOOKS.dynamic;
    
    return fallbackBase.map(h => ({
      ...h,
      id: "fallback-" + Math.random().toString(36).substr(2, 5),
      category: "Verified Strategy"
    }));
  }
}

export async function generateExtraAI(type: string, context: string, lang: string = "English", tone: string = "Professional") {
  const model = "gemini-3-flash-preview";
  let prompt = "";
  let schema: any = { type: Type.OBJECT, properties: { result: { type: Type.STRING } } };

  // Common instruction for local language/tone
  const common = `Language: ${lang}. Tone: ${tone}.`;
  
  switch(type) {
    case "caption":
      prompt = `Generate 3 Instagram Reel captions for this hook: "${context}". Include: 1 short, 1 storytelling, 1 CTA style. Use emojis. ${common}`;
      schema = {
        type: Type.OBJECT,
        properties: { captions: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["captions"]
      };
      break;
    case "hashtags":
      prompt = `Generate 15 optimized hashtags for this hook: "${context}". Mix high reach, medium competition, and niche-specific. ${common}`;
      schema = {
        type: Type.OBJECT,
        properties: { hashtags: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["hashtags"]
      };
      break;
    case "script":
      prompt = `Generate a 30-second Reel script for this hook: "${context}". Include talking points and a strong closing CTA. ${common}`;
      schema = {
        type: Type.OBJECT,
        properties: { script: { type: Type.STRING } },
        required: ["script"]
      };
      break;
    case "ideas":
      prompt = `Generate 10 trending Reel ideas for the niche: "${context}". Include emotional trigger and difficulty level. ${common}`;
      schema = {
        type: Type.OBJECT,
        properties: {
          ideas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                trigger: { type: Type.STRING },
                difficulty: { type: Type.STRING }
              },
              required: ["title", "trigger", "difficulty"]
            }
          }
        },
        required: ["ideas"]
      };
      break;
    case "improve":
      prompt = `Improve this hook: "${context}". Provide 5 viral variations with scores. ${common}`;
      schema = {
        type: Type.OBJECT,
        properties: {
          variations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                score: { type: Type.NUMBER }
              },
              required: ["text", "score"]
            }
          }
        },
        required: ["variations"]
      };
      break;
    case "analyze":
      prompt = `Analyze this hook: "${context}". Provide viral potential score (0-100), explanation, psychological trigger used, and curiosity gap strength. ${common}`;
      schema = {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          explanation: { type: Type.STRING },
          trigger: { type: Type.STRING },
          gapStrength: { type: Type.STRING }
        },
        required: ["score", "explanation", "trigger", "gapStrength"]
      };
      break;
    case "angle":
      prompt = `Generate 5 different content angles for the topic: "${context}". Include title, description, and a sample hook for each. ${common}`;
      schema = {
        type: Type.OBJECT,
        properties: {
          angles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                hook: { type: Type.STRING }
              },
              required: ["title", "description", "hook"]
            }
          }
        },
        required: ["angles"]
      };
      break;
    case "time":
      prompt = `Suggest the best posting time and day for the niche: "${context}". Include bestDay, bestTime, and a strategy tip. ${common}`;
      schema = {
        type: Type.OBJECT,
        properties: {
          bestDay: { type: Type.STRING },
          bestTime: { type: Type.STRING },
          strategy: { type: Type.STRING }
        },
        required: ["bestDay", "bestTime", "strategy"]
      };
      break;
    case "calendar":
      prompt = `Generate a 7-day viral content roadmap for the niche: "${context}". Include topic and hookType for each day. ${common}`;
      schema = {
        type: Type.OBJECT,
        properties: {
          plan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                hookType: { type: Type.STRING }
              },
              required: ["topic", "hookType"]
            }
          }
        },
        required: ["plan"]
      };
      break;
    case "bio":
      prompt = `Generate 5 viral Instagram bios for this niche/description: "${context}". Use emojis, include a CTA, and keep it under 150 chars. ${common}`;
      schema = {
        type: Type.OBJECT,
        properties: { bios: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["bios"]
      };
      break;
    case "username":
      prompt = `Generate 10 catchy and unique Instagram usernames for: "${context}". Avoid excessive numbers/underscores. ${common}`;
      schema = {
        type: Type.OBJECT,
        properties: { usernames: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["usernames"]
      };
      break;
    case "dp":
      prompt = `Suggest 5 creative profile picture (DP) ideas or AI prompts for: "${context}". ${common}`;
      schema = {
        type: Type.OBJECT,
        properties: { ideas: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["ideas"]
      };
      break;
    case "transcript":
      prompt = `Clean up and summarize this video transcript: "${context}". ${common}`;
      schema = {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          cleanText: { type: Type.STRING }
        },
        required: ["summary", "cleanText"]
      };
      break;
    default:
      prompt = `Help me with this Instagram content task: "${context}". ${common}`;
  }

  const fetchExtra = async () => {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: { 
        systemInstruction: `You are an expert social media growth assistant. Current context - Language: ${lang}, Tone: ${tone}. Return ONLY the requested JSON structure.`,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseSchema: schema
      }
    });

    if (!response.text) throw new Error("Empty Extra Response");
    return safeJsonParse(response.text, {});
  };

  try {
    const data = await withRetry(fetchExtra);
    
    if (data.variations) {
      data.variations = data.variations.map((v: any) => ({
        ...v,
        score: typeof v.score === 'string' ? parseInt(v.score) : v.score
      }));
    }
    if (data.score && typeof data.score === 'string') {
      data.score = parseInt(data.score);
    }
    return data;
  } catch (error) {
    console.error("AI Extra Fatal Error:", error);
    // Generic fallback for extra tools
    if (type === "hashtags") return { hashtags: ["#viral", "#reels", "#contentcreator", "#trending", "#growth"] };
    if (type === "caption") return { captions: ["Follow for more viral tips!", "POV: You found the secret hack.", "Tag a creator who needs this."] };
    return {};
  }
}
