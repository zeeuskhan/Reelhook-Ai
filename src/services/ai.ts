import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export function safeJsonParse(text: string, fallback: any = []) {
  try {
    const cleanText = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error:", e, "Original text:", text);
    return fallback;
  }
}

export async function generateHooksAI(niche: string, sub: string, lang: string, tone: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Generate 10 unique, high-retention Instagram Reel hooks for the niche: ${niche} (${sub}).
  Language: ${lang}. Tone: ${tone}.
  
  Each hook must:
  - Be under 10 words.
  - Use psychological triggers (Curiosity gap, FOMO, Pattern interrupt, Bold claim).
  - Include a viral percentage score (60-98%) based on retention psychology.`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: { 
        systemInstruction: "You are a viral short-form content strategist. Return ONLY the requested JSON structure.",
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
    
    if (!response.text) {
      console.warn("AI response empty");
      return [];
    }

    const data = safeJsonParse(response.text, []);
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
    console.error("AI Hooks Error:", error);
    return [];
  }
}

export async function generateExtraAI(type: string, context: string) {
  const model = "gemini-3-flash-preview";
  let prompt = "";
  let schema: any = { type: Type.OBJECT, properties: { result: { type: Type.STRING } } };
  
  switch(type) {
    case "caption":
      prompt = `Generate 3 Instagram Reel captions for this hook: "${context}". Include: 1 short, 1 storytelling, 1 CTA style. Use emojis.`;
      schema = {
        type: Type.OBJECT,
        properties: { captions: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["captions"]
      };
      break;
    case "hashtags":
      prompt = `Generate 15 optimized hashtags for this hook: "${context}". Mix high reach, medium competition, and niche-specific.`;
      schema = {
        type: Type.OBJECT,
        properties: { hashtags: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["hashtags"]
      };
      break;
    case "script":
      prompt = `Generate a 30-second Reel script for this hook: "${context}". Include talking points and a strong closing CTA.`;
      schema = {
        type: Type.OBJECT,
        properties: { script: { type: Type.STRING } },
        required: ["script"]
      };
      break;
    case "ideas":
      prompt = `Generate 10 trending Reel ideas for the niche: "${context}". Include emotional trigger and difficulty level.`;
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
      prompt = `Improve this hook: "${context}". Provide 5 viral variations with scores.`;
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
      prompt = `Analyze this hook: "${context}". Provide viral potential score (0-100), explanation, psychological trigger used, and curiosity gap strength.`;
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
      prompt = `Generate 5 different content angles for the topic: "${context}". Include title, description, and a sample hook for each.`;
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
      prompt = `Suggest the best posting time and day for the niche: "${context}". Include bestDay, bestTime, and a strategy tip.`;
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
      prompt = `Generate a 7-day viral content roadmap for the niche: "${context}". Include topic and hookType for each day.`;
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
      prompt = `Generate 5 viral Instagram bios for this niche/description: "${context}". Use emojis, include a CTA, and keep it under 150 chars.`;
      schema = {
        type: Type.OBJECT,
        properties: { bios: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["bios"]
      };
      break;
    case "username":
      prompt = `Generate 10 catchy and unique Instagram usernames for: "${context}". Avoid excessive numbers/underscores.`;
      schema = {
        type: Type.OBJECT,
        properties: { usernames: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["usernames"]
      };
      break;
    case "dp":
      prompt = `Suggest 5 creative profile picture (DP) ideas or AI prompts for: "${context}".`;
      schema = {
        type: Type.OBJECT,
        properties: { ideas: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["ideas"]
      };
      break;
    case "transcript":
      prompt = `Clean up and summarize this video transcript: "${context}".`;
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
      prompt = `Help me with this Instagram content task: "${context}".`;
  }

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: { 
        systemInstruction: "You are a social media growth expert. Return ONLY the requested JSON structure.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseSchema: schema
      }
    });
    const data = safeJsonParse(response.text || "{}", {});
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
    console.error("AI Extra Error:", error);
    return {};
  }
}
