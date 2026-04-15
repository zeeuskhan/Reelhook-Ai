import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { 
  Sparkles, 
  Search, 
  Zap, 
  Copy, 
  Save, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  MessageSquare, 
  Hash, 
  FileText, 
  Lightbulb, 
  Menu, 
  X,
  Star,
  Award,
  Globe,
  Mail,
  Info,
  BookOpen,
  Plus,
  FolderPlus,
  Trash2,
  MoreVertical,
  Calendar,
  RefreshCw,
  BarChart3,
  Bookmark,
  Download,
  Users,
  ChevronDown,
  Instagram,
  Youtube,
  Twitter,
  Linkedin
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function safeJsonParse(text: string, fallback: any = []) {
  try {
    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error:", e, "Original text:", text);
    return fallback;
  }
}

// --- SEO Component ---
const SEO = ({ 
  title, 
  description, 
  canonical, 
  schema,
  type = "website",
  image = "https://www.reelhooks.site/og-image.png"
}: { 
  title: string, 
  description: string, 
  canonical?: string, 
  schema?: any,
  type?: string,
  image?: string
}) => {
  const siteUrl = "https://www.reelhooks.site";
  const fullTitle = title.includes("ReelHooks.site") ? title : `${title} | ReelHooks.site`;
  const fullCanonical = canonical || `${siteUrl}${window.location.pathname}`;
  
  // 2026 Semantic Keywords
  const keywords = "viral reel hook generator, instagram reel hook generator, ai reel hooks, reel hooks in hindi, hinglish reel hooks, fitness reel hooks, business reel hooks, tiktok hook generator, youtube shorts hooks, content creator tools AI";

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="google-site-verification" content="X3VhNru6pUg4Jwkr9GZDBtGK_m0u8SK7rOe7md4LAZ8" />
      <link rel="canonical" href={fullCanonical} />
      <link rel="icon" href="https://lh3.googleusercontent.com/d/1DgUBQfN4OlaAYmhqX7ZGgPj7389xzkVt" />
      <link rel="shortcut icon" href="https://lh3.googleusercontent.com/d/1DgUBQfN4OlaAYmhqX7ZGgPj7389xzkVt" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Hreflang (Future-proofing for Hindi/Hinglish) */}
      <link rel="alternate" href={fullCanonical} hrefLang="x-default" />
      <link rel="alternate" href={fullCanonical} hrefLang="en" />
      <link rel="alternate" href={fullCanonical.replace(".site/", ".site/hi/")} hrefLang="hi" />

      {/* OpenGraph / Facebook */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content="ReelHooks.site" />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@reelhooks" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema Injection */}
      {schema && (
        Array.isArray(schema) ? (
          schema.map((s, i) => (
            <script key={i} type="application/ld+json">
              {JSON.stringify(s)}
            </script>
          ))
        ) : (
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )
      )}
    </Helmet>
  );
};

// --- Constants & Data ---
import { NICHES, type Niche } from "./data/niches";
import { SEO_CATEGORY_CONTENT } from "./data/seoContent";
import { SEO_ARTICLES } from "./data/seoArticles";
import BannerAd from "./components/BannerAd";
import PopupAd from "./components/PopupAd";
import FooterAd from "./components/FooterAd";
import SkyscraperAd from "./components/SkyscraperAd";

const ToolSEOPage = lazy(() => import("./components/ToolSEOPage"));
const SEOArticlePage = lazy(() => import("./components/SEOArticlePage"));

const LANGUAGES = ["English", "Hindi", "Hinglish", "Spanish", "French"];
const TONES = ["Curious", "Bold", "Relatable", "Educational", "Controversial", "Funny"];

// --- Types ---
interface Hook {
  id: string;
  text: string;
  score: number;
  category: string;
}

// --- AI Service ---
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function generateHooksAI(niche: string, sub: string, lang: string, tone: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `You are a viral short-form content strategist. 
  Generate 10 unique, high-retention Instagram Reel hooks for the niche: ${niche} (${sub}).
  Language: ${lang}. Tone: ${tone}.
  
  Each hook must:
  - Be under 10 words.
  - Use psychological triggers (Curiosity gap, FOMO, Pattern interrupt, Bold claim).
  - Include a viral percentage score (60-98%) based on retention psychology.
  
  Return ONLY a JSON array of objects with "text" and "score" properties. No explanation.`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    const data = safeJsonParse(response.text || "[]");
    return data.map((h: any) => {
      const score = typeof h.score === 'string' ? parseInt(h.score) : h.score;
      return {
        id: Math.random().toString(36).substr(2, 9),
        text: h.text,
        score: score,
        category: score >= 90 ? "High Viral Potential" : score >= 75 ? "Strong Hook" : "Needs Improvement"
      };
    });
  } catch (error) {
    console.error("AI Error:", error);
    return [];
  }
}

async function generateExtraAI(type: "caption" | "hashtags" | "script" | "ideas" | "improve" | "analyze" | "angle" | "time" | "calendar", context: string) {
  const model = "gemini-3-flash-preview";
  let prompt = "";
  
  if (type === "caption") {
    prompt = `Generate 3 Instagram Reel captions for this hook: "${context}". 
    Include: 1 short, 1 storytelling, 1 CTA style. Use emojis. Return JSON: { captions: string[] }`;
  } else if (type === "hashtags") {
    prompt = `Generate 15 optimized hashtags for this hook: "${context}". 
    Mix high reach, medium competition, and niche-specific. Return JSON: { hashtags: string[] }`;
  } else if (type === "script") {
    prompt = `Generate a 30-second Reel script for this hook: "${context}". 
    Include talking points and a strong closing CTA. Return JSON: { script: string }`;
  } else if (type === "ideas") {
    prompt = `Generate 10 trending Reel ideas for the niche: "${context}". 
    Include emotional trigger and difficulty level. Return JSON: { ideas: { title: string, trigger: string, difficulty: string }[] }`;
  } else if (type === "improve") {
    prompt = `Improve this hook: "${context}". 
    Provide 5 viral variations with scores. Return JSON: { variations: { text: string, score: number }[] }`;
  } else if (type === "analyze") {
    prompt = `Analyze this hook: "${context}". 
    Provide viral potential score (0-100), explanation, psychological trigger used, and curiosity gap strength. 
    Return JSON: { score: number, explanation: string, trigger: string, gapStrength: string }`;
  } else if (type === "angle") {
    prompt = `Generate 5 different content angles for the topic: "${context}". 
    Include title, description, and a sample hook for each. 
    Return JSON: { angles: { title: string, description: string, hook: string }[] }`;
  } else if (type === "time") {
    prompt = `Suggest the best posting time and day for the niche: "${context}". 
    Include bestDay, bestTime, and a strategy tip. 
    Return JSON: { bestDay: string, bestTime: string, strategy: string }`;
  } else if (type === "calendar") {
    prompt = `Generate a 7-day viral content roadmap for the niche: "${context}". 
    Include topic and hookType for each day. 
    Return JSON: { plan: { topic: string, hookType: string }[] }`;
  }

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    const data = safeJsonParse(response.text || "{}", {});
    if (data.variations) {
      data.variations = data.variations.map((v: any) => ({
        ...v,
        score: typeof v.score === 'string' ? parseInt(v.score) : v.score
      }));
    }
    if (data.score) {
      data.score = typeof data.score === 'string' ? parseInt(data.score) : data.score;
    }
    return data;
  } catch (error) {
    console.error("AI Error:", error);
    return {};
  }
}

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative glass w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-3xl flex flex-col"
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-bold font-display">{title}</h3>
            <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const CopyButton = ({ text, className }: { text: string, className?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className={cn("p-2 rounded-lg transition-all cursor-pointer", className)}
      title="Copy to clipboard"
    >
      {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="https://lh3.googleusercontent.com/d/1Yv39bPRG3c5koN20sCuYeMRPS_Id23oy" 
              alt="ReelHooks Logo" 
              className="h-10 w-auto"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#features" className="text-text-secondary hover:text-white transition-colors">Features</Link>
            <Link to="/explore" className="text-text-secondary hover:text-white transition-colors">Explore</Link>
            <Link to="/blog" className="text-text-secondary hover:text-white transition-colors">Blog</Link>
            <Link to="/about" className="text-text-secondary hover:text-white transition-colors">About</Link>
            <Link to="/dashboard" className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105">
              Launch App
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-text-secondary">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass border-b border-white/10 px-4 py-6 space-y-4"
          >
          <Link to="/#features" className="block text-text-secondary text-lg py-2" onClick={() => setIsOpen(false)}>Features</Link>
          <Link to="/explore" className="block text-text-secondary text-lg py-2" onClick={() => setIsOpen(false)}>Explore</Link>
          <Link to="/blog" className="block text-text-secondary text-lg py-2" onClick={() => setIsOpen(false)}>Blog</Link>
          <Link to="/about" className="block text-text-secondary text-lg py-2" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/dashboard" className="block bg-primary text-white px-5 py-4 rounded-full text-center font-bold text-lg" onClick={() => setIsOpen(false)}>Launch App</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-bg border-t border-white/5 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link to="/" className="flex items-center">
            <img 
              src="https://lh3.googleusercontent.com/d/1Yv39bPRG3c5koN20sCuYeMRPS_Id23oy" 
              alt="ReelHooks Logo" 
              className="h-8 w-auto"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </Link>
          <p className="text-text-secondary text-base">
            AI-powered hooks that stop scrolling and boost engagement for creators worldwide.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://instagram.com/reelhooks" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://twitter.com/reelhooks" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://youtube.com/@reelhooks" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/company/reelhooks" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold mb-4 text-lg">Product</h4>
          <ul className="space-y-3 text-base text-text-secondary">
            <li><Link to="/dashboard" className="hover:text-primary transition-colors py-1 block">Hook Generator</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary transition-colors py-1 block">Caption Builder</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary transition-colors py-1 block">Hashtag Packs</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold mb-4 text-lg">Company</h4>
          <ul className="space-y-3 text-base text-text-secondary">
            <li><Link to="/about" className="hover:text-primary transition-colors py-1 block">About Us</Link></li>
            <li><Link to="/privacy" className="hover:text-primary transition-colors py-1 block">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary transition-colors py-1 block">Terms of Service</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold mb-4 text-lg">Support</h4>
          <ul className="space-y-3 text-base text-text-secondary">
            <li><a href="mailto:support@reelhooks.site" className="hover:text-primary transition-colors py-1 block">Contact Us</a></li>
            <li><Link to="/faq" className="hover:text-primary transition-colors py-1 block">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/5 text-center text-text-secondary text-sm">
        © {new Date().getFullYear()} ReelHooks.site. All rights reserved.
      </div>
    </div>
  </footer>
);

const Hero = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => (prev < 10000 ? prev + 123 : 10000));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(108,92,231,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-6 py-3 rounded-full text-primary text-base font-medium"
        >
          <Sparkles className="w-5 h-5" />
          <span>Trusted by {count.toLocaleString()}+ creators</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold font-display leading-tight tracking-tight"
        >
          Viral AI Hook Generator <br />
          <span className="text-primary">for Instagram Reels</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
        >
          AI-powered hooks that stop scrolling and boost engagement. 
          Stop guessing and start going viral with our content suite.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Link to="/dashboard" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-105 shadow-lg shadow-primary/25">
            <span>Start Generating Hooks</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-12 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all"
        >
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6" />
            <span className="text-base font-bold">4.9/5 Rating</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6" />
            <span className="text-base font-bold">10k+ Creators</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ProgrammaticHooksPage = () => {
  const { slug } = useParams();
  const [slugId, lang] = (slug || "fitness-english").split("-");
  
  const nicheInfo = useMemo(() => {
    const main = NICHES.find(n => n.id === slugId);
    if (main) return { name: main.name, id: main.id, isMain: true };
    
    for (const n of NICHES) {
      const sub = n.subcategories.find(s => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slugId);
      if (sub) return { name: sub, id: slugId, isMain: false, parent: n.name };
    }
    return { name: slugId.charAt(0).toUpperCase() + slugId.slice(1), id: slugId, isMain: true };
  }, [slugId]);

  const nicheName = nicheInfo.name;
  const displayLang = lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : "English";
  
  const relatedNiches = useMemo(() => {
    return NICHES.filter(n => n.id !== slugId).slice(0, 12);
  }, [slugId]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ReelHooks.site",
    "operatingSystem": "Web",
    "applicationCategory": "MultimediaApplication",
    "url": "https://www.reelhooks.site",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "10000"
    }
  };

  const nicheStrategy = useMemo(() => {
    const strategies: Record<string, { title: string, content: string }> = {
      fitness: { title: "Fitness Content Strategy", content: "Focus on transformations and form corrections. Use hooks that challenge common myths or promise a specific result in a set timeframe." },
      finance: { title: "Finance Content Strategy", content: "Trust is everything. Use hooks that mention specific numbers, percentages, or 'hidden' rules that the average person doesn't know." },
      business: { title: "Business Content Strategy", content: "Focus on efficiency and ROI. Hooks should address common bottlenecks or share 'insider' secrets from successful founders." },
      tech: { title: "Tech Content Strategy", content: "Show, don't just tell. Use hooks that highlight a 'mind-blowing' feature or a tool that saves hours of work." },
      beauty: { title: "Beauty Content Strategy", content: "Visual hooks are key. Use 'Before vs After' hooks or 'Stop using this product' to trigger immediate curiosity." },
      "social-media": { title: "Social Media Strategy", content: "Focus on growth hacks and algorithm updates. Use hooks that promise to 'double your reach' or 'fix your low engagement'." },
      health: { title: "Health & Wellness Strategy", content: "Focus on holistic improvements. Use hooks that address common symptoms like fatigue or stress and offer a simple solution." },
      parenting: { title: "Parenting Content Strategy", content: "Relatability is your superpower. Use hooks that describe a common 'parenting fail' or a 'life-saving' hack for toddlers." },
      career: { title: "Career Growth Strategy", content: "Focus on professional advancement. Use hooks about salary negotiation, interview secrets, or corporate survival tips." },
      "mental-health": { title: "Mental Health Strategy", content: "Be gentle and supportive. Use hooks that validate feelings or offer a 30-second grounding technique." }
    };
    return strategies[slugId] || { 
      title: `${nicheName} Growth Strategy`, 
      content: `To grow in the ${nicheName} niche, focus on providing consistent value and using pattern-interrupting hooks. Your audience wants to see authentic content that solves their specific ${nicheName} problems.` 
    };
  }, [slugId, nicheName]);

  const nicheFAQs = useMemo(() => [
    { 
      q: `What are the best ${nicheName} reel hooks?`, 
      a: `The best ${nicheName} reel hooks are those that create a curiosity gap or offer immediate value to your audience. For example, starting with "The secret to ${nicheName}..." or "Stop doing ${nicheName} like this."` 
    },
    { 
      q: `How can I grow my ${nicheName} page on Instagram?`, 
      a: `Consistency and high-quality hooks are key. By using our ${nicheName} hook generator, you can ensure your ${displayLang} reels stop the scroll and keep viewers engaged longer.` 
    },
    { 
      q: `Do ${nicheName} hooks work in ${displayLang}?`, 
      a: `Yes, absolutely! Whether you're using English, Hindi, or Hinglish, the psychology of a hook remains the same. Our tool is optimized for ${displayLang} to help you reach a wider audience.` 
    },
    { 
      q: `How often should I use new hooks for ${nicheName} reels?`, 
      a: `You should try to use a unique hook for every single reel. This keeps your content fresh and prevents the algorithm from flagging your videos as repetitive.` 
    }
  ], [nicheName, displayLang]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": nicheFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const seoTitle = `Best ${nicheName} Reel Hooks 2026 – Free AI Generator`;
  const seoDescription = `Get 100+ viral ${nicheName} reel hooks, scripts, and captions in ${displayLang}. Optimized for Instagram, TikTok, and Shorts. Boost your ${nicheName} content engagement today!`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": seoTitle,
    "description": seoDescription,
    "image": `https://www.reelhooks.site/og-${slugId}.png`,
    "author": {
      "@type": "Organization",
      "name": "ReelHooks AI Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ReelHooks",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lh3.googleusercontent.com/d/1Yv39bPRG3c5koN20sCuYeMRPS_Id23oy"
      }
    },
    "datePublished": "2026-01-01T08:00:00+08:00",
    "dateModified": new Date().toISOString()
  };

  const breadcrumbSchema = {
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
        "name": nicheName,
        "item": `https://www.reelhooks.site/hooks/${slug}`
      }
    ]
  };

  const richContent = SEO_CATEGORY_CONTENT[slugId];

  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-16">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        schema={[articleSchema, faqSchema, breadcrumbSchema]}
      />
      
      <div className="space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold font-display capitalize">{nicheName} Reel Hooks Generator</h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          {richContent?.introduction || `Struggling to get views on your ${nicheName} reels? The first 3 seconds are everything. 
          Our instagram hook generator has analyzed thousands of viral videos to bring you 
          these high-performing viral reel hooks specifically optimized for the ${nicheName} niche. 
          Whether you need reel hooks in hindi or english, we've got you covered.`}
        </p>
      </div>

      <BannerAd />
      <SkyscraperAd />

      <div className="space-y-8">
        <h2 className="text-3xl font-bold">Examples of Viral Reel Hooks for {nicheName}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "The secret to {niche} that nobody tells you...",
            "Stop doing {niche} like this if you want results.",
            "I wish I knew this about {niche} sooner.",
            "3 mistakes you're making in {niche}.",
            "How I achieved {result} in {niche} in just 30 days.",
            "Why your {niche} isn't working (and how to fix it).",
            "The only {niche} guide you'll ever need.",
            "I tried every {niche} hack so you don't have to.",
            "This one change doubled my {niche} results.",
            "Steal my {niche} routine for maximum growth."
          ].map((h, i) => (
            <div key={i} className="glass p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all">
              <p className="font-medium italic">"{h.replace(/{niche}/g, nicheName).replace(/{result}/g, "success")}"</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-8 rounded-3xl space-y-8 border-primary/20 bg-primary/5">
        <h2 className="text-3xl font-bold">{nicheStrategy.title}</h2>
        <p className="text-lg text-text-secondary leading-relaxed italic">
          "{nicheStrategy.content}"
        </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <h3 className="font-bold text-primary text-lg">Target Audience</h3>
              <p className="text-base text-text-secondary">People interested in {nicheName} who are looking for quick, actionable, and entertaining content on Instagram.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-primary text-lg">Content Pillar</h3>
              <p className="text-base text-text-secondary">Educational tutorials, relatable memes, and high-value {nicheName} tips that encourage saves and shares.</p>
            </div>
          </div>
      </div>

      <div className="glass p-8 rounded-3xl space-y-8">
        <h2 className="text-3xl font-bold">Why Hooks Matter for Reels and Shorts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-bold text-primary text-lg">Hook Psychology</h3>
            <p className="text-base text-text-secondary">Start with a visual or verbal shock to stop the scroll immediately. This is the core of viral reel hooks.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-primary text-lg">Attention Grabbing Intros</h3>
            <p className="text-base text-text-secondary">Open a loop in the viewer's mind that can only be closed by watching the full reel. Use bold text overlays.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-primary text-lg">Short-form Storytelling</h3>
            <p className="text-base text-text-secondary">Keep it fast-paced. Every second must provide value or build tension to keep retention high.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-primary text-lg">Strong Call to Action</h3>
            <p className="text-base text-text-secondary">Tell people exactly what to do next: follow, save, or comment to boost the algorithm.</p>
          </div>
        </div>
        {richContent && (
          <div className="pt-8 border-t border-white/10">
            <p className="text-text-secondary leading-relaxed">{richContent.section1}</p>
          </div>
        )}
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-bold">Best Hooks for the {nicheName} Niche</h2>
        <p className="text-text-secondary leading-relaxed">
          {richContent?.section2 || `The best hooks for reels in the ${nicheName} niche are those that address specific pain points or offer immediate transformation. 
          By using our instagram hook generator, you can ensure your content stands out in a crowded feed. 
          These hooks work because they leverage human curiosity and the desire for self-improvement or entertainment.`}
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-bold">How ReelHooks.site Helps You Generate Viral Hooks</h2>
        <p className="text-text-secondary leading-relaxed">
          {richContent?.section3 || `In the ${nicheName} community, competition is fierce. Every day, thousands of creators post high-quality content, but only a few actually get the views they deserve. The difference? A compelling hook. 
          When you use a viral reel hook, you're not just tricking people into watching. You're respecting their time by immediately showing them why your video is worth their attention.`}
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-bold">Conclusion</h2>
        <p className="text-text-secondary leading-relaxed">
          {richContent?.conclusion || `Whether you're sharing a quick tip, a transformation story, or a behind-the-scenes look at your ${nicheName} journey, your hook is the bridge between your content and your audience. Experiment with different hooks and see what works best for your audience.`}
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-bold">FAQ: Viral {nicheName} Reel Hooks</h2>
        <div className="space-y-4">
          {nicheFAQs.map((faq, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h4 className="font-bold mb-2 text-lg">{faq.q}</h4>
              <p className="text-base text-text-secondary">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Related Niches</h2>
        <div className="flex flex-wrap gap-3">
          {relatedNiches.map(rn => (
            <Link 
              key={rn.id} 
              to={`/hooks/${rn.id}-${lang}`}
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-base hover:bg-primary/10 hover:border-primary/30 transition-all"
            >
              {rn.name} Hooks
            </Link>
          ))}
        </div>
      </div>

      <div className="text-center pt-12">
        <Link to="/dashboard" className="bg-primary text-white px-8 py-4 rounded-full font-bold inline-block hover:scale-105 transition-all shadow-lg shadow-primary/25">
          Generate Custom {nicheName} Hooks Now
        </Link>
        <p className="mt-4 text-sm text-text-secondary">Try our <span className="text-primary">instagram hook generator</span> today.</p>
      </div>
    </div>
  );
};
const About = () => (
  <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-16">
    <SEO 
      title="About ReelHooks | The Team Behind the Viral AI Hook Generator"
      description="Learn about ReelHooks, the AI-powered platform helping 10,000+ creators go viral with scroll-stopping hooks, captions, and scripts."
      schema={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.reelhooks.site/" },
          { "@type": "ListItem", "position": 2, "name": "About", "item": "https://www.reelhooks.site/about" }
        ]
      }}
    />
    <div className="text-center space-y-6">
      <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight">Empowering the Next Generation of Creators</h1>
      <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
        ReelHooks.site was born out of a simple observation: content creation is hard, but the "hook" shouldn't be. 
        In a world of infinite scrolling, the first few seconds of your video determine its success.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Our Story</h2>
        <p className="text-text-secondary leading-relaxed">
          It started in a small home office where we analyzed thousands of viral Instagram Reels. We realized that while many creators had great content, they struggled to capture attention in the first 3 seconds. 
        </p>
        <p className="text-text-secondary leading-relaxed">
          Our team of AI engineers and content strategists built ReelHooks.site to level the playing field. We combined retention psychology with advanced language models to create a tool that generates viral hooks in seconds.
        </p>
      </div>
      <div className="glass p-8 rounded-3xl border-white/5 space-y-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-lg">Fast & Efficient</h4>
            <p className="text-base text-text-secondary">Generate 10+ hooks in under 5 seconds.</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-lg">Data Driven</h4>
            <p className="text-base text-text-secondary">Based on viral patterns and retention metrics.</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-lg">Multi-Language</h4>
            <p className="text-base text-text-secondary">Support for English, Hindi, Hinglish, and more.</p>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
      {[
        { label: "Active Creators", value: "10k+" },
        { label: "Hooks Generated", value: "1M+" },
        { label: "Niches Covered", value: "50+" },
        { label: "Viral Success", value: "95%" }
      ].map((stat, i) => (
        <div key={i} className="text-center p-6 glass rounded-2xl border-white/5">
          <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
          <div className="text-base text-text-secondary">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
);

const Contact = () => (
  <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-12">
    <SEO 
      title="Contact ReelHooks | Support & Collaboration for Creators"
      description="Have questions or feedback? Contact the ReelHooks team for support, collaborations, or feature requests."
      schema={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.reelhooks.site/" },
          { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://www.reelhooks.site/contact" }
        ]
      }}
    />
    <div className="text-center space-y-4">
      <h1 className="text-4xl md:text-6xl font-bold font-display">Get in Touch</h1>
      <p className="text-xl text-text-secondary max-w-2xl mx-auto">
        Have questions about our viral reel hook generator? Or just want to say hi? We'd love to hear from you.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
          <h3 className="text-2xl font-bold">Why reach out?</h3>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
              <span className="text-text-secondary"><strong>Technical Support:</strong> Need help with the dashboard or AI tools?</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
              <span className="text-text-secondary"><strong>Partnerships:</strong> Interested in collaborating with ReelHooks.site?</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
              <span className="text-text-secondary"><strong>Feedback:</strong> Have ideas on how we can improve our viral hooks?</span>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col space-y-4 px-4">
          <div className="flex items-center space-x-4 text-text-secondary">
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider">Email Us</p>
              <p className="text-white text-base">support@reelhooks.site</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-text-secondary">
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider">Location</p>
              <p className="text-white text-base">San Francisco, CA</p>
            </div>
          </div>
        </div>
      </div>

      <form className="glass p-8 rounded-3xl space-y-6 border-white/5">
        <div className="space-y-2">
          <label className="text-base font-medium">Full Name</label>
          <input type="text" className="w-full bg-bg border border-white/10 rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <label className="text-base font-medium">Email Address</label>
          <input type="email" className="w-full bg-bg border border-white/10 rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="john@example.com" />
        </div>
        <div className="space-y-2">
          <label className="text-base font-medium">Subject</label>
          <select className="w-full bg-bg border border-white/10 rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-primary/50 transition-all">
            <option>General Inquiry</option>
            <option>Technical Support</option>
            <option>Partnership</option>
            <option>Feedback</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-base font-medium">Message</label>
          <textarea className="w-full bg-bg border border-white/10 rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[150px]" placeholder="How can we help you today?"></textarea>
        </div>
        <button type="button" className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
          Send Message
        </button>
      </form>
    </div>
  </div>
);

const Explore = () => (
  <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto space-y-16">
    <SEO 
      title="Explore Viral Reel Hook Niches | Find Your Perfect Content Hook"
      description="Browse 100+ content niches and find the perfect viral hooks for your next Instagram Reel, TikTok, or YouTube Short."
      schema={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.reelhooks.site/" },
          { "@type": "ListItem", "position": 2, "name": "Explore", "item": "https://www.reelhooks.site/explore" }
        ]
      }}
    />
    <div className="text-center space-y-6">
      <h1 className="text-4xl md:text-6xl font-bold font-display">Explore All Categories</h1>
      <p className="text-xl text-text-secondary max-w-2xl mx-auto">
        Find the perfect viral hooks for your specific niche. We cover over 50+ categories and hundreds of subcategories.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {NICHES.map(n => (
        <div key={n.id} className="glass p-8 rounded-3xl border-white/5 space-y-6 hover:border-primary/30 transition-all group">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{n.name}</h3>
            <Link to={`/hooks/${n.id.toLowerCase()}-english`} className="text-primary hover:underline text-base font-bold flex items-center">
              <span>View Hooks</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {n.subcategories.slice(0, 8).map(s => (
              <span key={s} className="text-sm uppercase tracking-widest font-bold px-3 py-1 bg-white/5 rounded-full text-text-secondary border border-white/10">
                {s}
              </span>
            ))}
            {n.subcategories.length > 8 && (
              <span className="text-sm uppercase tracking-widest font-bold px-3 py-1 text-text-secondary">
                +{n.subcategories.length - 8} more
              </span>
            )}
          </div>
        </div>
      ))}
    </div>

    <div className="bg-primary/5 border border-primary/20 p-12 rounded-[3rem] text-center space-y-6">
      <h2 className="text-3xl font-bold">Can't find your niche?</h2>
      <p className="text-text-secondary max-w-xl mx-auto">
        Our AI can generate hooks for ANY niche, even if it's not listed here. Just head to the dashboard and type in your specific topic.
      </p>
      <Link to="/dashboard" className="bg-primary text-white px-10 py-4 rounded-full font-bold inline-block hover:scale-105 transition-all shadow-xl shadow-primary/25">
        Go to Dashboard
      </Link>
    </div>
  </div>
);

const FAQ = () => (
  <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-12">
    <SEO 
      title="ReelHooks FAQ | How to Use AI to Go Viral on Instagram"
      description="Find answers to common questions about ReelHooks, AI hook generation, and how to boost your social media engagement."
      schema={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.reelhooks.site/" },
          { "@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://www.reelhooks.site/faq" }
        ]
      }}
    />
    <SEO 
      title="Frequently Asked Questions" 
      description="Find answers to common questions about ReelHooks.site, our viral reel hook generator, and how to boost your social media engagement." 
    />
    <div className="text-center space-y-4">
      <h1 className="text-4xl md:text-6xl font-bold font-display">Frequently Asked Questions</h1>
      <p className="text-xl text-text-secondary max-w-2xl mx-auto">
        Everything you need to know about our viral reel hook generator and how to use it effectively.
      </p>
    </div>

    <div className="space-y-6">
      {[
        { 
          q: "What is a reel hook?", 
          a: "A reel hook is the first 1-3 seconds of your video that determines whether a user will stop scrolling or move on. It's the most critical part of viral content creation." 
        },
        { 
          q: "How does the viral hook generator work?", 
          a: "Our tool uses advanced AI models trained on thousands of high-performing Instagram Reels and TikToks. It analyzes your niche and target audience to generate hooks that leverage psychological triggers like curiosity and FOMO." 
        },
        { 
          q: "Can I use these hooks for TikTok and YouTube Shorts?", 
          a: "Yes! While we focus on Instagram Reels, the psychology of short-form video is the same across platforms. These hooks work perfectly for TikTok and YouTube Shorts as well." 
        },
        { 
          q: "Is ReelHooks.site free to use?", 
          a: "Yes, ReelHooks.site is currently free for all creators. You can generate hooks, captions, and scripts without any subscription fees." 
        },
        { 
          q: "How many hooks should I try for one video?", 
          a: "We recommend generating at least 10 hooks and picking the one that best fits your specific video content. You can also A/B test different hooks by posting similar content with different opening lines." 
        },
        { 
          q: "Do you support languages other than English?", 
          a: "Yes, we support English, Hindi, Hinglish, Spanish, and French. We are constantly adding more languages to help creators worldwide." 
        }
      ].map((faq, i) => (
        <div key={i} className="glass p-8 rounded-3xl border-white/5 space-y-4">
          <h3 className="text-xl font-bold flex items-start space-x-3">
            <span className="text-primary font-mono">Q:</span>
            <span>{faq.q}</span>
          </h3>
          <div className="flex items-start space-x-3 text-text-secondary leading-relaxed">
            <span className="text-secondary font-mono">A:</span>
            <p>{faq.a}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="text-center pt-12">
      <p className="text-text-secondary mb-6">Still have questions?</p>
      <Link to="/contact" className="bg-white text-bg px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-all">
        Contact Support
      </Link>
    </div>
  </div>
);

const Legal = ({ title }: { title: string }) => (
  <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-12">
    <SEO 
      title={title} 
      description={`${title} for ReelHooks.site. Read our legal terms and policies for using our viral reel hook generator.`} 
    />
    <div className="space-y-4">
      <h1 className="text-4xl md:text-6xl font-bold font-display">{title}</h1>
      <p className="text-text-secondary">Last updated: April 5, 2026</p>
    </div>
    
    <div className="prose prose-invert max-w-none text-text-secondary space-y-10">
      <section className="space-y-4">
        <h2 className="text-white font-bold text-2xl">1. Introduction</h2>
        <p>
          Welcome to ReelHooks.site. These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use ReelHooks.site if you do not accept all of the terms and conditions stated on this page.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-white font-bold text-2xl">2. Intellectual Property Rights</h2>
        <p>
          Other than the content you own, under these Terms, ReelHooks.site and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted a limited license only for purposes of viewing the material contained on this Website.
        </p>
        <p>
          The AI-generated content (hooks, scripts, captions) provided by our service is for your use in your social media content. While you own the rights to the specific output generated for you, the underlying algorithms and templates remain the property of ReelHooks.site.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-white font-bold text-2xl">3. User Responsibilities</h2>
        <p>
          As a user of ReelHooks.site, you agree to use our viral reel hook generator responsibly. You must not use our service to generate content that is:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Illegal, harmful, or threatening.</li>
          <li>Infringing on any third-party intellectual property rights.</li>
          <li>Hate speech or discriminatory in nature.</li>
          <li>Deceptive or misleading to audiences.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-white font-bold text-2xl">4. Limitation of Liability</h2>
        <p>
          In no event shall ReelHooks.site, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website. ReelHooks.site, including its officers, directors, and employees, shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Website.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-white font-bold text-2xl">5. Data Privacy</h2>
        <p>
          Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using ReelHooks.site, you also agree to our Privacy Policy. We use industry-standard security measures to protect your data and ensure a safe experience on our platform.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-white font-bold text-2xl">6. Governing Law</h2>
        <p>
          These Terms will be governed by and interpreted in accordance with the laws of the State of California, and you submit to the non-exclusive jurisdiction of the state and federal courts located in California for the resolution of any disputes.
        </p>
      </section>
    </div>
  </div>
);;

const SEOIntro = () => (
  <section className="py-20 px-4 bg-bg relative overflow-hidden">
    <div className="absolute inset-0 bg-primary/5 blur-[120px] -z-10" />
    <div className="max-w-4xl mx-auto space-y-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight">The #1 AI Hook Generator for Viral Reels</h2>
        <p className="text-xl text-text-secondary">Stop guessing and start growing. Our AI hook generator is engineered for maximum retention.</p>
      </div>

      <div className="space-y-12">
        <div className="space-y-6">
          <h3 className="text-3xl font-bold">Why Every Creator Needs a Viral Hook Generator</h3>
          <p className="text-text-secondary leading-relaxed">
            In 2026, the attention span of the average social media user has dropped to less than 3 seconds. This means that the first few moments of your Instagram Reel, TikTok, or YouTube Short are the most critical. If you don't capture attention immediately, your content—no matter how high-quality it is—will be ignored. This is where a <span className="text-white font-medium">viral hook generator</span> becomes your most powerful tool.
          </p>
          <p className="text-text-secondary leading-relaxed">
            ReelHooks.site isn't just another AI tool. It's a specialized engine trained on the psychology of viral content. We analyze patterns from millions of successful videos to provide you with hooks that are mathematically more likely to stop the scroll. Whether you're looking for <span className="text-white font-medium">best hooks for instagram reels</span> or high-converting TikTok intros, our platform delivers results in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary">Data-Driven Hook Engineering</h3>
            <p className="text-text-secondary leading-relaxed">
              Our <span className="text-white font-medium">instagram hook generator</span> leverages advanced machine learning to identify trending "pattern interrupts." These are visual or verbal cues that break a user's scrolling trance. By using our tool, you're not just getting a sentence; you're getting a scientifically backed opening designed to trigger curiosity and drive engagement.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary">Hindi & Hinglish Optimization</h3>
            <p className="text-text-secondary leading-relaxed">
              We understand the nuances of the Indian creator economy. That's why we've built the world's first <span className="text-white font-medium">reel hooks in hindi</span> and Hinglish generator. Generic English hooks often fail to resonate with local audiences. Our AI understands cultural context, slang, and emotional triggers specific to the Indian demographic, giving you a massive edge over the competition.
            </p>
          </div>
        </div>

        <div className="glass p-12 rounded-[3rem] border-primary/20 space-y-8">
          <h3 className="text-3xl font-bold text-center">Mastering the 3-Second Retention Rule</h3>
          <p className="text-center text-text-secondary max-w-2xl mx-auto">
            The Instagram algorithm rewards one thing above all else: Watch Time. If you can keep a viewer engaged for the first 3 seconds, the chances of them watching the entire video increase by over 70%.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto text-primary font-bold text-xl">1</div>
              <h4 className="font-bold text-lg">The Pattern Interrupt</h4>
              <p className="text-sm text-text-secondary">Break the user's scrolling habit with a bold claim or a visual surprise.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto text-primary font-bold text-xl">2</div>
              <h4 className="font-bold text-lg">The Curiosity Gap</h4>
              <p className="text-sm text-text-secondary">Ask a question or present a problem that the viewer *needs* to see the answer to.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto text-primary font-bold text-xl">3</div>
              <h4 className="font-bold text-lg">The Value Promise</h4>
              <p className="text-sm text-text-secondary">Clearly state what the viewer will gain by watching until the end of the video.</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-3xl font-bold">Best Niches for Viral Hooks</h3>
          <p className="text-text-secondary leading-relaxed">
            While our <span className="text-white font-medium">free reel hook maker</span> works for any topic, certain niches see explosive growth when using optimized hooks. Here's how different creators are using ReelHooks.site:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Fitness & Health", desc: "Stop using generic 'workout tips' and start using hooks like 'Why your squats aren't working'." },
              { title: "Finance & Crypto", desc: "Leverage FOMO and authority with hooks like 'The hidden bank rule costing you thousands'." },
              { title: "Business & SaaS", desc: "Build trust and curiosity with 'How I built a 6-figure business in 90 days'." },
              { title: "Beauty & Fashion", desc: "Use transformation hooks like 'The 5-minute glow up secret nobody tells you'." },
              { title: "Tech & Gadgets", desc: "Trigger curiosity with 'Stop buying iPhones until you see this hidden feature'." },
              { title: "Food & Cooking", desc: "Create instant cravings with 'The secret ingredient that makes any dish viral'." }
            ].map((niche, i) => (
              <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-2">
                <h4 className="font-bold text-primary">{niche.title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed">{niche.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-3xl font-bold">How to Use the ReelHooks AI Suite</h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/20 p-3 rounded-xl text-primary shrink-0"><Sparkles className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold">Step 1: Define Your Niche</h4>
                <p className="text-sm text-text-secondary">Our AI works best when it knows your target audience. Select from our 50+ pre-defined niches or enter your custom topic.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary/20 p-3 rounded-xl text-primary shrink-0"><Zap className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold">Step 2: Generate & Iterate</h4>
                <p className="text-sm text-text-secondary">Get 10+ viral hook options in seconds. Use the 'Hook Improver' to refine your own ideas or the 'Analyzer' to check viral potential.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary/20 p-3 rounded-xl text-primary shrink-0"><CheckCircle2 className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold">Step 3: Complete Your Strategy</h4>
                <p className="text-sm text-text-secondary">Don't stop at the hook. Generate SEO-optimized captions and high-reach hashtags to ensure your reel gets the maximum possible reach.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-12 rounded-[3rem] border border-primary/20 text-center space-y-6">
          <h3 className="text-3xl font-bold">Ready to Dominate the Algorithm?</h3>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Join thousands of successful creators who have transformed their social media presence with ReelHooks.site. Our <span className="text-white font-medium">best ai hook generator</span> is free, fast, and built for growth.
          </p>
          <Link to="/dashboard" className="bg-primary text-white px-12 py-5 rounded-full font-bold inline-flex items-center space-x-3 hover:scale-105 transition-all shadow-2xl shadow-primary/30">
            <span>Start Generating for Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
    
    {/* FAQ Schema */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the best AI hook generator for Instagram Reels?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ReelHooks.site is widely considered the best AI hook generator for Instagram Reels because it uses data-driven psychology and supports multiple languages including Hindi and Hinglish."
            }
          },
          {
            "@type": "Question",
            "name": "How do I make my reels go viral in 2026?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "To go viral in 2026, you must focus on the first 3 seconds of your video. Using a strong hook that creates a curiosity gap or pattern interrupt is essential for high retention and reach."
            }
          },
          {
            "@type": "Question",
            "name": "Does ReelHooks support Hindi and Hinglish?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, ReelHooks.site is the only viral hook generator optimized specifically for the Indian market with native support for Hindi and Hinglish hooks."
            }
          }
        ]
      })}
    </script>
  </section>
);

const BLOG_POSTS = [
  {
    id: "science-of-hooks",
    title: "The Science of Viral Reel Hooks",
    excerpt: "Why some hooks work and others don't. A deep dive into retention psychology.",
    date: "March 15, 2026",
    content: `
      In the fast-paced world of social media, attention is the most valuable currency. With millions of videos being uploaded every single day, creators are in a constant battle for the viewer's gaze. This is where the "hook" comes in. A hook is the first 1-3 seconds of your video that determines whether a user will stop scrolling or move on to the next piece of content.

      At ReelHooks.site, we've spent thousands of hours analyzing viral content across Instagram, TikTok, and YouTube. We've discovered that viral hooks aren't just random luck; they follow specific psychological patterns. Our AI-powered generator is built on these principles, helping you craft opening lines that trigger curiosity, tap into FOMO (Fear Of Missing Out), or present a bold claim that demands an explanation.

      ### Why Your Instagram Reels Need Better Hooks
      Instagram's algorithm prioritizes retention. If users watch your video until the end, Instagram is more likely to push it to a wider audience on the Explore page. The hook is the gatekeeper of retention. Without a strong hook, your high-quality editing and valuable content will never be seen.
    `
  },
  {
    id: "instagram-algorithm-2026",
    title: "Instagram Algorithm Update 2026: What's New?",
    excerpt: "What creators need to know about the latest changes to the Reels algorithm in 2026.",
    date: "March 28, 2026",
    content: `
      The 2026 Instagram algorithm update has shifted its focus significantly towards "Originality" and "Meaningful Interaction." Gone are the days when simply reposting trending content would get you millions of views. 

      ### The Rise of Original Content
      Instagram is now explicitly rewarding creators who produce unique, high-quality content. This means that using tools like ReelHooks.site to generate unique hooks and scripts is more important than ever. The algorithm can now detect if a hook has been used thousands of times before and may limit its reach.

      ### Retention is Still King
      While the metrics have evolved, retention remains the most important factor for the Reels algorithm. If you can keep a viewer engaged for more than 50% of your video, your chances of hitting the Explore page increase by over 300%. This is why the first 3 seconds—the hook—remain the most critical part of your content strategy.
    `
  },
  {
    id: "hindi-content-growth",
    title: "How to Go Viral with Hindi Reels in 2026",
    excerpt: "Strategies for tapping into the massive Indian audience with localized content.",
    date: "April 2, 2026",
    content: `
      The Indian creator economy is booming, and Hindi content is leading the charge. However, many creators struggle to find the right balance between "Pure Hindi" and "Hinglish."

      ### The Power of Localized Hooks
      Using reel hooks in hindi can significantly increase your relatability with the local audience. At ReelHooks.site, we've seen that hooks that tap into local cultural nuances or common Indian household scenarios tend to perform 40% better than generic translated hooks.

      ### Hinglish: The Language of the Youth
      For the Gen-Z and Millennial audience in India, Hinglish is the preferred mode of communication. It feels natural, conversational, and less formal. When generating hooks for this demographic, ensure you use a mix of English keywords and Hindi conversational fillers to maximize engagement.
    `
  }
];

const Blog = () => {
  const allPosts = useMemo(() => {
    const seoPosts = Object.values(SEO_ARTICLES).map(article => ({
      id: article.slug,
      title: article.title,
      excerpt: article.metaDescription,
      date: "April 2026",
      isSEO: true
    }));
    
    const regularPosts = BLOG_POSTS.map(post => ({
      ...post,
      isSEO: false
    }));
    
    return [...regularPosts, ...seoPosts];
  }, []);

  return (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto space-y-12">
      <SEO 
        title="ReelHooks Blog | Content Creation Tips & AI Strategies 2026"
        description="Expert tips on content creation, viral hooks, and AI strategies to help you grow your audience on Instagram, TikTok, and YouTube."
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.reelhooks.site/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.reelhooks.site/blog" }
          ]
        }}
      />
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold font-display">Creator Insights</h1>
        <p className="text-xl text-text-secondary">Master the art of short-form video content with our 50+ expert guides.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {allPosts.map(post => (
          <Link 
            key={post.id} 
            to={post.isSEO ? `/${post.id}` : `/blog/${post.id}`} 
            className="glass p-8 rounded-3xl border-white/5 hover:border-primary/30 transition-all group flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm text-primary font-bold">{post.date}</p>
              {post.isSEO && <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-full uppercase font-bold">Guide</span>}
            </div>
            <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
            <p className="text-text-secondary text-base leading-relaxed mb-6 line-clamp-3 flex-1">{post.excerpt}</p>
            <div className="flex items-center text-base font-bold text-white group-hover:translate-x-2 transition-transform mt-auto">
              <span>Read Full Article</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const BlogPost = () => {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === id);
  if (!post) return <div>Post not found</div>;

  return (
    <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto space-y-8">
      <SEO 
        title={`${post.title} | ReelHooks Blog`}
        description={post.excerpt}
        type="article"
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.reelhooks.site/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.reelhooks.site/blog" },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://www.reelhooks.site/blog/${post.id}` }
          ]
        }}
      />
      <Link to="/blog" className="text-text-secondary hover:text-white flex items-center space-x-2 text-base">
        <ArrowRight className="w-5 h-5 rotate-180" />
        <span>Back to Blog</span>
      </Link>
      <div className="space-y-4">
        <p className="text-primary font-bold">{post.date}</p>
        <h1 className="text-4xl md:text-5xl font-bold font-display">{post.title}</h1>
      </div>
      <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed space-y-6">
        {post.content.split("\n").map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [niche, setNiche] = useState(NICHES[0]);
  const [sub, setSub] = useState(NICHES[0].subcategories[0]);
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [tone, setTone] = useState(TONES[0]);
  
  const [nicheSearch, setNicheSearch] = useState("");
  const [isNicheDropdownOpen, setIsNicheDropdownOpen] = useState(false);
  const [nicheSelectedIndex, setNicheSelectedIndex] = useState(-1);

  const [isGenerating, setIsGenerating] = useState(false);
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [activeTab, setActiveTab] = useState<"hooks" | "ideas" | "improver" | "tools" | "saved">("hooks");
  
  const filteredNiches = useMemo(() => {
    if (!nicheSearch) return NICHES;
    const search = nicheSearch.toLowerCase();
    return NICHES.filter(n => 
      n.name.toLowerCase().includes(search) || 
      n.subcategories.some(s => s.toLowerCase().includes(search))
    );
  }, [nicheSearch]);

  const handleNicheSelect = (n: Niche, s?: string) => {
    setNiche(n);
    setSub(s || n.subcategories[0]);
    setNicheSearch(s ? `${n.name} > ${s}` : n.name);
    setIsNicheDropdownOpen(false);
    setNicheSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isNicheDropdownOpen) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setNicheSelectedIndex(prev => (prev < filteredNiches.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setNicheSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && nicheSelectedIndex >= 0) {
      e.preventDefault();
      handleNicheSelect(filteredNiches[nicheSelectedIndex]);
    } else if (e.key === "Escape") {
      setIsNicheDropdownOpen(false);
    }
  };

  const [savedHooks, setSavedHooks] = useState<Hook[]>(() => {
    try {
      const saved = localStorage.getItem("reelhook_saved");
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  const [folders, setFolders] = useState<{ id: string, name: string }[]>(() => {
    try {
      const saved = localStorage.getItem("reelhook_folders");
      return saved ? JSON.parse(saved) : [{ id: "all", name: "All Hooks" }];
    } catch (e) { return [{ id: "all", name: "All Hooks" }]; }
  });
  const [activeFolder, setActiveFolder] = useState("all");
  const [hookFolderMap, setHookFolderMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("reelhook_map");
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });

  useEffect(() => {
    try {
      localStorage.setItem("reelhook_saved", JSON.stringify(savedHooks));
      localStorage.setItem("reelhook_folders", JSON.stringify(folders));
      localStorage.setItem("reelhook_map", JSON.stringify(hookFolderMap));
    } catch (e) { console.error("Storage error:", e); }
  }, [savedHooks, folders, hookFolderMap]);

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (name && name.trim()) {
      setFolders(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name: name.trim() }]);
    }
  };

  const handleDeleteFolder = (id: string) => {
    if (id === "all") return;
    if (confirm("Delete this folder? Hooks will remain in 'All Hooks'.")) {
      setFolders(prev => prev.filter(f => f.id !== id));
      if (activeFolder === id) setActiveFolder("all");
      const newMap = { ...hookFolderMap };
      Object.keys(newMap).forEach(key => {
        if (newMap[key] === id) delete newMap[key];
      });
      setHookFolderMap(newMap);
    }
  };

  const handleMoveToFolder = (hookId: string, folderId: string) => {
    setHookFolderMap(prev => ({ ...prev, [hookId]: folderId }));
  };

  const filteredSavedHooks = useMemo(() => {
    if (activeFolder === "all") return savedHooks;
    return savedHooks.filter(h => hookFolderMap[h.id] === activeFolder);
  }, [savedHooks, activeFolder, hookFolderMap]);
  const [modal, setModal] = useState<{ isOpen: boolean, title: string, content: React.ReactNode }>({
    isOpen: false,
    title: "",
    content: null
  });

  const handleExtra = async (type: "caption" | "hashtags" | "script" | "ideas" | "improve" | "analyze" | "angle" | "time" | "calendar", context: string) => {
    setModal({ isOpen: true, title: `Generating ${type}...`, content: <div className="flex justify-center py-12"><RefreshCw className="animate-spin w-8 h-8 text-primary" /></div> });
    const result = await generateExtraAI(type as any, context);
    
    let content = null;
    if (type === "caption") {
      content = (
        <div className="space-y-4">
          {result.captions?.map((c: string, i: number) => (
            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 relative group">
              <p className="text-base leading-relaxed pr-8">{c}</p>
              <CopyButton text={c} className="absolute top-4 right-4 text-text-secondary hover:text-white" />
            </div>
          ))}
        </div>
      );
    } else if (type === "hashtags") {
      content = (
        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 relative">
            <p className="text-primary font-mono text-base leading-relaxed">{result.hashtags?.join(" ")}</p>
            <CopyButton text={result.hashtags?.join(" ") || ""} className="absolute top-4 right-4 text-text-secondary hover:text-white" />
          </div>
        </div>
      );
    } else if (type === "script") {
      content = (
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 relative">
          <pre className="text-base whitespace-pre-wrap font-sans leading-relaxed">{result.script}</pre>
          <CopyButton text={result.script || ""} className="absolute top-6 right-6 text-text-secondary hover:text-white" />
        </div>
      );
    } else if (type === "analyze") {
      content = (
        <div className="space-y-4">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-base text-text-secondary">Viral Potential</span>
              <span className={cn(
                "font-bold text-lg",
                result.score >= 90 ? "text-[#22C55E]" : result.score >= 75 ? "text-[#F59E0B]" : "text-[#EF4444]"
              )}>{result.score}%</span>
            </div>
            <p className="text-base leading-relaxed">{result.explanation}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg p-3 rounded-lg border border-white/5">
                <p className="text-xs uppercase tracking-widest text-text-secondary mb-1">Trigger</p>
                <p className="text-base font-bold">{result.trigger}</p>
              </div>
              <div className="bg-bg p-3 rounded-lg border border-white/5">
                <p className="text-xs uppercase tracking-widest text-text-secondary mb-1">Gap Strength</p>
                <p className="text-base font-bold">{result.gapStrength}</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (type === "angle") {
      content = (
        <div className="space-y-4">
          {result.angles?.map((a: any, i: number) => (
            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <h4 className="font-bold text-primary text-lg">{a.title}</h4>
              <p className="text-base text-text-secondary">{a.description}</p>
              <p className="text-sm italic text-white/60">Hook: {a.hook}</p>
            </div>
          ))}
        </div>
      );
    } else if (type === "time") {
      content = (
        <div className="space-y-4">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg p-4 rounded-xl border border-white/5 text-center">
                <p className="text-sm text-text-secondary mb-1">Best Day</p>
                <p className="font-bold text-primary text-lg">{result.bestDay}</p>
              </div>
              <div className="bg-bg p-4 rounded-xl border border-white/5 text-center">
                <p className="text-sm text-text-secondary mb-1">Best Time</p>
                <p className="font-bold text-primary text-lg">{result.bestTime}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-base font-bold">Strategy Tip</p>
              <p className="text-base text-text-secondary leading-relaxed">{result.strategy}</p>
            </div>
          </div>
        </div>
      );
    } else if (type === "calendar") {
      content = (
        <div className="space-y-4">
          {result.plan?.map((p: any, i: number) => (
            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start space-x-4">
              <div className="bg-primary/20 text-primary w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shrink-0">
                D{i+1}
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold">{p.topic}</p>
                <p className="text-sm text-text-secondary">{p.hookType}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    setModal({ isOpen: true, title: `${type.charAt(0).toUpperCase() + type.slice(1)} Result`, content });
  };

  const [ideas, setIdeas] = useState<{ title: string, trigger: string, difficulty: string }[]>([]);
  const [improveInput, setImproveInput] = useState("");
  const [improvedHooks, setImprovedHooks] = useState<{ text: string, score: number }[]>([]);

  const handleGenerateIdeas = async () => {
    setIsGenerating(true);
    try {
      const result = await generateExtraAI("ideas", niche.name);
      setIdeas(result.ideas || []);
    } catch (err) {
      console.error("Ideas generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImprove = async () => {
    if (!improveInput) return;
    setIsGenerating(true);
    try {
      const result = await generateExtraAI("improve", improveInput);
      setImprovedHooks(result.variations || []);
    } catch (err) {
      console.error("Hook improvement failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveHook = (hook: Hook) => {
    setSavedHooks(prev => {
      const exists = prev.find(h => h.id === hook.id);
      let next;
      if (exists) {
        next = prev.filter(h => h.id !== hook.id);
      } else {
        next = [...prev, hook];
      }
      localStorage.setItem("reelhook_saved", JSON.stringify(next));
      return next;
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const results = await generateHooksAI(niche.name, sub, lang, tone);
      
      if (results.length === 0) {
        setModal({
          isOpen: true,
          title: "Generation Error",
          content: <p className="text-center py-4">Something went wrong while generating hooks. Please try again.</p>
        });
      } else {
        setHooks(results);
      }
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <SEO 
        title="ReelHooks Dashboard | Generate Viral Hooks, Captions & Hashtags"
        description="Access your ReelHooks dashboard to generate high-converting hooks, captions, and hashtags for your social media content."
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.reelhooks.site/" },
            { "@type": "ListItem", "position": 2, "name": "Dashboard", "item": "https://www.reelhooks.site/dashboard" }
          ]
        }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-6 rounded-2xl space-y-6">
            <h2 className="text-xl font-bold font-display flex items-center space-x-2">
              <Zap className="text-primary w-5 h-5" />
              <span>Configure Generator</span>
            </h2>
            
            <div className="space-y-4">
              {/* Niche Selection */}
              <div className="space-y-4">
                <div className="space-y-2 relative">
                  <label className="text-base font-medium text-text-secondary">Niche / Category</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Search className="w-5 h-5 text-text-secondary" />
                    </div>
                    <input 
                      type="text"
                      value={nicheSearch}
                      onChange={(e) => {
                        setNicheSearch(e.target.value);
                        setIsNicheDropdownOpen(true);
                      }}
                      onFocus={() => setIsNicheDropdownOpen(true)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search niche..."
                      className="w-full bg-bg border border-white/10 rounded-xl py-4 pl-12 pr-4 text-base outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    {isNicheDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 max-h-64 overflow-y-auto glass rounded-xl border border-white/10 z-50 custom-scrollbar shadow-2xl">
                        {filteredNiches.length > 0 ? (
                          filteredNiches.map((n, idx) => (
                            <div key={n.id}>
                              <button 
                                onClick={() => handleNicheSelect(n)}
                                className={cn(
                                  "w-full text-left px-4 py-2 text-sm font-bold hover:bg-primary/20 transition-all flex items-center justify-between",
                                  nicheSelectedIndex === idx ? "bg-primary/30" : ""
                                )}
                              >
                                <span>{n.name}</span>
                                <ChevronDown className="w-3 h-3 opacity-50" />
                              </button>
                              <div className="bg-white/5">
                                {n.subcategories.map(s => (
                                  <button 
                                    key={s}
                                    onClick={() => handleNicheSelect(n, s)}
                                    className="w-full text-left px-8 py-2 text-sm text-text-secondary hover:text-white hover:bg-primary/10 transition-all"
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-sm text-text-secondary">No niches found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Info */}
                <div className="flex items-center space-x-2 text-sm text-text-secondary bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="font-bold text-primary">Selected:</span>
                  <span>{niche.name}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span>{sub}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-base font-medium text-text-secondary">Language</label>
                  <select 
                    className="w-full bg-bg border border-white/10 rounded-xl py-3 px-4 text-base focus:ring-2 focus:ring-primary/50 outline-none"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                  >
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-base font-medium text-text-secondary">Tone</label>
                  <select 
                    className="w-full bg-bg border border-white/10 rounded-xl py-3 px-4 text-base focus:ring-2 focus:ring-primary/50 outline-none"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Hooks</span>
                </>
              )}
            </button>
          </div>

          {/* Sidebar Info */}
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-xl">Viral Content Suite</h3>
            <ul className="text-base space-y-3 text-text-secondary">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Unlimited generations</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Access all viral hooks</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Caption & Hashtag generator</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tabs */}
          <div className="flex space-x-1 bg-white/5 p-1 rounded-xl overflow-x-auto custom-scrollbar">
            {(["hooks", "ideas", "improver", "tools", "saved"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap",
                  activeTab === tab ? "bg-primary text-white shadow-lg" : "text-text-secondary hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {activeTab === "hooks" ? (
              isGenerating ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="glass p-6 rounded-2xl animate-pulse space-y-4">
                      <div className="h-6 bg-white/10 rounded w-3/4"></div>
                      <div className="h-4 bg-white/10 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : hooks.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {hooks.map((hook, idx) => (
                    <motion.div 
                      key={hook.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="glass p-6 rounded-2xl relative overflow-hidden group"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <p className="text-lg font-medium leading-relaxed pr-8">
                            {hook.text}
                          </p>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleSaveHook(hook)}
                              className={cn(
                                "transition-colors cursor-pointer",
                                savedHooks.find(h => h.id === hook.id) ? "text-primary" : "text-text-secondary hover:text-white"
                              )}
                            >
                              <Bookmark className="w-5 h-5" fill={savedHooks.find(h => h.id === hook.id) ? "currentColor" : "none"} />
                            </button>
                            <CopyButton text={hook.text} className="text-text-secondary hover:text-white" />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${hook.score}%` }}
                              className={cn(
                                "h-full rounded-full transition-colors duration-500",
                                hook.score >= 90 ? "bg-[#22C55E]" : hook.score >= 75 ? "bg-[#F59E0B]" : "bg-[#EF4444]"
                              )}
                            />
                          </div>
                          <span className={cn(
                            "text-xs font-bold px-2 py-1 rounded flex items-center space-x-1",
                            hook.score >= 90 ? "bg-[#22C55E]/10 text-[#22C55E]" : hook.score >= 75 ? "bg-[#F59E0B]/10 text-[#F59E0B]" : "bg-[#EF4444]/10 text-[#EF4444]"
                          )}>
                            <span>{hook.score}%</span>
                            <span>{hook.category}</span>
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <button 
                            onClick={() => handleExtra("caption", hook.text)}
                            className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Caption</span>
                          </button>
                          <button 
                            onClick={() => handleExtra("hashtags", hook.text)}
                            className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <Hash className="w-3.5 h-3.5" />
                            <span>Hashtags</span>
                          </button>
                          <button 
                            onClick={() => handleExtra("script", hook.text)}
                            className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Script</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="glass p-12 rounded-2xl text-center space-y-4 border-dashed border-white/10">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <Lightbulb className="text-text-secondary w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">Ready to go viral?</h3>
                  <p className="text-text-secondary max-w-sm mx-auto">
                    Select your niche and tone on the left to generate high-performing hooks for your next Reel.
                  </p>
                </div>
              )
            ) : activeTab === "ideas" ? (
              <div className="space-y-6">
                <button 
                  onClick={handleGenerateIdeas}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <span>Generate {niche.name} Ideas</span>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ideas.map((idea, i) => (
                    <div key={i} className="glass p-6 rounded-2xl space-y-3">
                      <h4 className="font-bold">{idea.title}</h4>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">Trigger: {idea.trigger}</span>
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">{idea.difficulty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === "improver" ? (
              <div className="space-y-6">
                <div className="glass p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold">Hook Improver</h3>
                  <textarea 
                    placeholder="Paste your weak hook here..."
                    className="w-full bg-bg border border-white/10 rounded-xl p-4 min-h-[100px] focus:ring-2 focus:ring-primary/50 outline-none"
                    value={improveInput}
                    onChange={(e) => setImproveInput(e.target.value)}
                  />
                  <button 
                    onClick={handleImprove}
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold cursor-pointer"
                  >
                    Improve My Hook
                  </button>
                </div>
                <div className="space-y-4">
                  {improvedHooks.map((h, i) => (
                    <div key={i} className="glass p-4 rounded-xl flex items-center justify-between">
                      <p className="text-sm font-medium">{h.text}</p>
                      <span className={cn(
                        "text-xs font-bold px-2 py-1 rounded",
                        h.score >= 90 ? "bg-[#22C55E]/10 text-[#22C55E]" : h.score >= 75 ? "bg-[#F59E0B]/10 text-[#F59E0B]" : "bg-[#EF4444]/10 text-[#EF4444]"
                      )}>{h.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === "tools" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: "analyze", icon: <BarChart3 />, title: "Hook Analyzer", desc: "Analyze any hook's viral potential." },
                  { id: "angle", icon: <TrendingUp />, title: "Content Angles", desc: "Get 5 different angles for your topic." },
                  { id: "time", icon: <Zap />, title: "Posting Time", desc: "Best time to post for your niche." },
                  { id: "calendar", icon: <FileText />, title: "Content Calendar", desc: "7-day viral content roadmap." }
                ].map((tool) => (
                  <button 
                    key={tool.id}
                    onClick={() => handleExtra(tool.id as any, niche.name)}
                    className="glass p-8 rounded-3xl border-white/5 hover:border-primary/30 transition-all group text-left cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-primary">
                      {tool.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                    <p className="text-text-secondary text-sm">{tool.desc}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar pb-2">
                    {folders.map(f => (
                      <button 
                        key={f.id}
                        onClick={() => setActiveFolder(f.id)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center space-x-2",
                          activeFolder === f.id ? "bg-primary text-white" : "bg-white/5 text-text-secondary hover:bg-white/10"
                        )}
                      >
                        <span>{f.name}</span>
                        {f.id !== "all" && (
                          <X 
                            className="w-3 h-3 hover:text-red-400" 
                            onClick={(e) => { e.stopPropagation(); handleDeleteFolder(f.id); }} 
                          />
                        )}
                      </button>
                    ))}
                    <button 
                      onClick={handleCreateFolder}
                      className="p-2 rounded-xl bg-white/5 text-text-secondary hover:bg-white/10 transition-all"
                    >
                      <FolderPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {filteredSavedHooks.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredSavedHooks.map((hook, idx) => (
                      <div key={hook.id} className="glass p-6 rounded-2xl space-y-4 relative group">
                        <div className="flex justify-between items-start">
                          <p className="text-lg font-medium leading-relaxed pr-12">{hook.text}</p>
                          <div className="flex items-center space-x-2">
                            <div className="relative group/menu">
                              <button className="text-text-secondary hover:text-white p-1">
                                <MoreVertical className="w-5 h-5" />
                              </button>
                              <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl border border-white/10 p-2 hidden group-hover/menu:block z-20 shadow-2xl">
                                <p className="text-[10px] uppercase tracking-widest text-text-secondary px-2 py-1">Move to Folder</p>
                                {folders.map(f => (
                                  <button 
                                    key={f.id}
                                    onClick={() => handleMoveToFolder(hook.id, f.id)}
                                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 transition-all"
                                  >
                                    {f.name}
                                  </button>
                                ))}
                                <div className="h-px bg-white/10 my-1" />
                                <button 
                                  onClick={() => handleSaveHook(hook)}
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-400/10 transition-all flex items-center space-x-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Remove Hook</span>
                                </button>
                              </div>
                            </div>
                            <CopyButton text={hook.text} className="text-text-secondary hover:text-white p-1" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                          <button 
                            onClick={() => handleExtra("caption", hook.text)}
                            className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Caption</span>
                          </button>
                          <button 
                            onClick={() => handleExtra("hashtags", hook.text)}
                            className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <Hash className="w-3.5 h-3.5" />
                            <span>Hashtags</span>
                          </button>
                          <button 
                            onClick={() => handleExtra("script", hook.text)}
                            className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Script</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass p-12 rounded-2xl text-center space-y-4 border-dashed border-white/10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                      <Bookmark className="text-text-secondary w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold">No hooks in this folder</h3>
                    <p className="text-text-secondary max-w-sm mx-auto">
                      Save hooks and organize them into folders to keep your content strategy structured.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-20 pt-12 border-t border-white/5 max-w-4xl mx-auto space-y-12 pb-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold font-display">Master the Art of Viral Content</h2>
          <p className="text-text-secondary">Use our AI-powered suite to dominate Instagram, TikTok, and YouTube Shorts.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-primary flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Viral Hooks</span>
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              The first 3 seconds are the most critical. Our <span className="text-white font-medium">instagram hook generator</span> uses retention psychology to craft opening lines that stop the scroll instantly.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-primary flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Smart Captions</span>
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Don't let your engagement die in the description. Generate SEO-optimized captions that drive saves, shares, and comments automatically.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-primary flex items-center space-x-2">
              <Hash className="w-4 h-4" />
              <span>Hashtag Strategy</span>
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Reach your target audience with precision. Our AI suggests high-reach and niche-specific hashtags to boost your discoverability on the Explore page.
            </p>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
          <h3 className="text-xl font-bold">Why use ReelHooks.site?</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            In 2026, the social media landscape is more competitive than ever. Generic content doesn't cut it anymore. ReelHooks.site provides you with a data-backed content strategy that leverages the latest AI models to ensure your reels have the best chance of going viral. Whether you're looking for <span className="text-white font-medium">reel hooks in hindi</span>, english, or hinglish, our tool adapts to your brand voice and target demographic.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Viral Hooks", "Instagram Growth", "Content Strategy", "AI Video Scripts", "Short-form Content", "Reel Hooks Hindi"].map(tag => (
              <span key={tag} className="text-sm uppercase tracking-widest font-bold px-3 py-1 bg-white/5 rounded-full text-text-secondary border border-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={modal.isOpen} 
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))} 
        title={modal.title}
      >
        {modal.content}
      </Modal>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <PopupAd />
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
              <Routes>
              <Route path="/" element={
                <>
                  <SEO 
                    title="Viral AI Hook Generator | Free Reel Hook Maker for Instagram & TikTok" 
                    description="Best AI Hook Generator for creators. Get scroll-stopping viral hooks, captions, and hashtags in seconds. Free AI reel hook maker with Hinglish & Hindi support." 
                    schema={[
                      {
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "ReelHooks.site",
                        "description": "AI-powered Viral Reel Hook Generator for Instagram, TikTok, and YouTube Shorts.",
                        "applicationCategory": "MultimediaApplication",
                        "operatingSystem": "Web",
                        "url": "https://www.reelhooks.site",
                        "offers": {
                          "@type": "Offer",
                          "price": "0",
                          "priceCurrency": "USD"
                        },
                        "aggregateRating": {
                          "@type": "AggregateRating",
                          "ratingValue": "4.9",
                          "reviewCount": "10250"
                        }
                      },
                      {
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "ReelHooks",
                        "url": "https://www.reelhooks.site",
                        "logo": "https://lh3.googleusercontent.com/d/1Yv39bPRG3c5koN20sCuYeMRPS_Id23oy",
                        "sameAs": [
                          "https://twitter.com/reelhooks",
                          "https://instagram.com/reelhooks"
                        ]
                      }
                    ]}
                  />
                  <Hero />
                  <BannerAd />
                  <SkyscraperAd />
                  
                  {/* Examples Section */}
                  <section className="py-20 px-4 bg-white/[0.02]">
                    <div className="max-w-7xl mx-auto">
                      <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold font-display">Viral Hook Examples</h2>
                        <p className="text-text-secondary max-w-2xl mx-auto">See how ReelHooks transforms boring intros into scroll-stopping viral moments.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                          { niche: "Fitness", old: "How to do a squat.", new: "Stop doing squats like this if you want to grow your glutes." },
                          { niche: "Finance", old: "Save money today.", new: "The hidden bank rule that's costing you $500 every single month." },
                          { niche: "Business", old: "My startup story.", new: "How I built a 6-figure business while working a 9-5." }
                        ].map((ex, i) => (
                          <div key={i} className="glass p-8 rounded-3xl border-white/5 space-y-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">{ex.niche}</span>
                            <div className="space-y-4">
                              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <p className="text-xs text-red-400 uppercase font-bold mb-1">Boring Intro</p>
                                <p className="text-sm text-text-secondary italic">"{ex.old}"</p>
                              </div>
                              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                <p className="text-xs text-green-400 uppercase font-bold mb-1">ReelHooks Viral Version</p>
                                <p className="text-sm font-bold">"{ex.new}"</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* How it Works */}
                  <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                          <h2 className="text-3xl md:text-5xl font-bold font-display">How to Go Viral in 3 Simple Steps</h2>
                          <div className="space-y-8">
                            {[
                              { step: "01", title: "Choose Your Niche", desc: "Select from 50+ categories or type your own specific topic." },
                              { step: "02", title: "AI Generation", desc: "Our AI analyzes 100k+ viral reels to craft the perfect hook for your audience." },
                              { step: "03", title: "Copy & Post", desc: "Get hooks, captions, and hashtags ready to use. Just copy and watch the views roll in." }
                            ].map((s, i) => (
                              <div key={i} className="flex items-start space-x-6">
                                <div className="text-4xl font-bold text-primary/20 font-display shrink-0">{s.step}</div>
                                <div className="space-y-2">
                                  <h3 className="text-xl font-bold">{s.title}</h3>
                                  <p className="text-text-secondary leading-relaxed">{s.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
                          <div className="glass p-8 rounded-[3rem] border-white/10 relative">
                            <div className="space-y-6">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                                  <Zap className="text-primary" />
                                </div>
                                <div>
                                  <p className="text-xs text-text-secondary uppercase tracking-widest font-bold">AI Analysis Complete</p>
                                  <h4 className="font-bold">Viral Potential: 98%</h4>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "98%" }}
                                    className="h-full bg-primary"
                                  />
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                  "This hook uses a curiosity gap and pattern interrupt that is currently trending in the fitness niche."
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Testimonials */}
                  <section className="py-20 px-4 bg-primary/5">
                    <div className="max-w-7xl mx-auto text-center space-y-16">
                      <h2 className="text-3xl md:text-5xl font-bold font-display">Trusted by 10,000+ Creators</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                          { name: "Sarah J.", role: "Fitness Influencer", text: "My reach doubled in just one week after I started using these hooks. It's a game changer!", rating: 5 },
                          { name: "Rahul M.", role: "Finance Creator", text: "The Hinglish support is incredible. Finally a tool that understands the Indian audience.", rating: 5 },
                          { name: "Alex K.", role: "Tech Reviewer", text: "I used to spend hours on hooks. Now it takes 5 seconds. Highly recommended!", rating: 5 }
                        ].map((t, i) => (
                          <div key={i} className="glass p-8 rounded-3xl border-white/5 text-left space-y-6">
                            <div className="flex space-x-1">
                              {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                            </div>
                            <p className="text-text-secondary italic">"{t.text}"</p>
                            <div>
                              <p className="font-bold">{t.name}</p>
                              <p className="text-xs text-text-secondary">{t.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Niches Grid */}
                  <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto space-y-16">
                      <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold font-display">Viral Hooks for Every Niche</h2>
                        <p className="text-text-secondary max-w-2xl mx-auto">Whether you're a gym rat or a crypto bro, we've got the perfect hooks for you.</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {NICHES.slice(0, 12).map(n => (
                          <Link 
                            key={n.id} 
                            to={`/hooks/${n.id.toLowerCase()}-english`}
                            className="glass p-6 rounded-2xl text-center hover:border-primary/50 transition-all group"
                          >
                            <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{n.name}</h3>
                          </Link>
                        ))}
                      </div>
                      <div className="text-center">
                        <Link to="/explore" className="text-primary font-bold hover:underline inline-flex items-center space-x-2">
                          <span>Explore All 50+ Niches</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </section>

                  {/* FAQ Section */}
                  <section className="py-20 px-4 bg-white/[0.02]">
                    <div className="max-w-3xl mx-auto space-y-16">
                      <h2 className="text-3xl md:text-5xl font-bold font-display text-center">Frequently Asked Questions</h2>
                      <div className="space-y-4">
                        {[
                          { q: "Is ReelHooks really free?", a: "Yes! Our core AI hook generator is 100% free for all creators." },
                          { q: "Does it support Hindi/Hinglish?", a: "Absolutely. We are the only tool optimized specifically for the Indian creator market with native Hindi and Hinglish support." },
                          { q: "Can I use these for YouTube Shorts?", a: "Yes, our hooks are optimized for all short-form video platforms including Instagram Reels, TikTok, and YouTube Shorts." },
                          { q: "How many hooks can I generate?", a: "There are no strict limits. You can generate as many hooks as you need for your content." }
                        ].map((faq, i) => (
                          <details key={i} className="glass rounded-2xl border-white/5 group overflow-hidden">
                            <summary className="p-6 cursor-pointer flex items-center justify-between list-none">
                              <h3 className="font-bold pr-4">{faq.q}</h3>
                              <ChevronDown className="w-5 h-5 text-text-secondary group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="px-6 pb-6 text-text-secondary leading-relaxed">
                              {faq.a}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  </section>

                  <SEOIntro />
                </>
              } />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Legal title="Privacy Policy" />} />
              <Route path="/terms" element={<Legal title="Terms of Service" />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/hooks/:slug" element={<ProgrammaticHooksPage />} />
              <Route path="/tools/instagram-bio-generator" element={<ToolSEOPage />} />
              <Route path="/tools/instagram-caption-generator" element={<ToolSEOPage />} />
              <Route path="/tools/instagram-hashtag-generator" element={<ToolSEOPage />} />
              <Route path="/tools/instagram-reel-generator" element={<ToolSEOPage />} />
              <Route path="/tools/instagram-username-generator" element={<ToolSEOPage />} />
              <Route path="/tools/instagram-dp-generator" element={<ToolSEOPage />} />
              <Route path="/tools/instagram-transcript-generator" element={<ToolSEOPage />} />
              <Route path="/tools/instagram-mockup-generator" element={<ToolSEOPage />} />
              <Route path="/:slug" element={<SEOArticlePage />} />
            </Routes>
          </Suspense>
          </main>
          <FooterAd />
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

