import SEOIntro from "./SEOIntro";
import React, { useState, useEffect, useMemo } from "react";
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
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
const SEO = ({ title, description, canonical, schema }: { title: string, description: string, canonical?: string, schema?: any }) => (
  <Helmet>
    <title>{title} | ReelHook AI</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical || window.location.href} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
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

// --- Constants & Data ---
import { NICHES, type Niche } from "./data/niches";

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
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">ReelHook AI</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#features" className="text-text-secondary hover:text-white transition-colors">Features</Link>
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
            <Link to="/#features" className="block text-text-secondary">Features</Link>
            <Link to="/dashboard" className="block bg-primary text-white px-5 py-2 rounded-full text-center">Launch App</Link>
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
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Zap className="text-white w-4 h-4" />
            </div>
            <span className="font-bold font-display">ReelHook AI</span>
          </div>
          <p className="text-text-secondary text-sm">
            AI-powered hooks that stop scrolling and boost engagement for creators worldwide.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li><Link to="/dashboard">Hook Generator</Link></li>
            <li><Link to="/dashboard">Caption Builder</Link></li>
            <li><Link to="/dashboard">Hashtag Packs</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li><a href="mailto:support@reelhook.ai">Contact Us</a></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/5 text-center text-text-secondary text-xs">
        © {new Date().getFullYear()} ReelHook AI. All rights reserved.
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
          className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full text-primary text-sm font-medium"
        >
          <Sparkles className="w-4 h-4" />
          <span>Trusted by {count.toLocaleString()}+ creators</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold font-display leading-tight tracking-tight"
        >
          Create Viral Reel Hooks <br />
          <span className="text-primary">in Seconds</span>
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
            <Award className="w-5 h-5" />
            <span className="text-sm font-bold">4.9/5 Rating</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span className="text-sm font-bold">10k+ Creators</span>
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
    "name": "ReelHook AI",
    "operatingSystem": "Web",
    "applicationCategory": "MultimediaApplication",
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a reel hook?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A reel hook is the first 1-3 seconds of your video that determines whether a user will stop scrolling or move on. It's crucial for viral reel hooks."
        }
      },
      {
        "@type": "Question",
        "name": "How to make reels viral?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To make reels viral, use an instagram hook generator like ReelHook AI, focus on high retention, and use trending audio."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best hook for Instagram reels?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best hooks for reels are those that create a curiosity gap or offer immediate value, especially reel hooks in hindi for the Indian market."
        }
      },
      {
        "@type": "Question",
        "name": "How long should a reel hook be?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A reel hook should ideally be between 1 to 3 seconds. It needs to be fast enough to stop the scroll but clear enough to convey the message."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://reelhook.ai/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Hooks",
        "item": "https://reelhook.ai/dashboard"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": nicheName,
        "item": `https://reelhook.ai/hooks/${slug}`
      }
    ]
  };

  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-16">
      <SEO 
        title={`${nicheName} Reel Hooks in ${displayLang} | Viral Reel Hooks`}
        description={`Get the best viral ${nicheName} reel hooks in ${displayLang}. Boost your Instagram engagement with our instagram hook generator. Best hooks for reels available.`}
        schema={[schema, faqSchema, breadcrumbSchema]}
      />
      
      <div className="space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold font-display capitalize">{nicheName} Reel Hooks Generator</h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Struggling to get views on your {nicheName} reels? The first 3 seconds are everything. 
          Our <span className="text-primary font-bold">instagram hook generator</span> has analyzed thousands of viral videos to bring you 
          these high-performing <span className="text-primary font-bold">viral reel hooks</span> specifically optimized for the {nicheName} niche. 
          Whether you need <span className="text-primary font-bold">reel hooks in hindi</span> or english, we've got you covered.
        </p>
      </div>

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

      <div className="glass p-8 rounded-3xl space-y-8">
        <h2 className="text-3xl font-bold">How to Make Viral Instagram Reels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-bold text-primary">Hook Psychology</h3>
            <p className="text-sm text-text-secondary">Start with a visual or verbal shock to stop the scroll immediately. This is the core of viral reel hooks.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-primary">Attention Grabbing Intros</h3>
            <p className="text-sm text-text-secondary">Open a loop in the viewer's mind that can only be closed by watching the full reel. Use bold text overlays.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-primary">Short-form Storytelling</h3>
            <p className="text-sm text-text-secondary">Keep it fast-paced. Every second must provide value or build tension to keep retention high.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-primary">Strong Call to Action</h3>
            <p className="text-sm text-text-secondary">Tell people exactly what to do next: follow, save, or comment to boost the algorithm.</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-bold">Best Reel Hooks for {nicheName}</h2>
        <p className="text-text-secondary leading-relaxed">
          The <span className="text-primary font-bold">best hooks for reels</span> in the {nicheName} niche are those that address specific pain points or offer immediate transformation. 
          By using our <span className="text-primary font-bold">instagram hook generator</span>, you can ensure your content stands out in a crowded feed. 
          These hooks work because they leverage human curiosity and the desire for self-improvement or entertainment.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-bold">FAQ: Viral Reel Hooks</h2>
        <div className="space-y-4">
          {[
            { q: `What is a reel hook?`, a: "A reel hook is the first 1-3 seconds of your video that determines whether a user will stop scrolling or move on. It's the most important part of viral reel hooks." },
            { q: "How to make reels viral?", a: "To make reels viral, you need a strong hook, high retention, and consistent posting. Using an instagram hook generator can help you find the best hooks for reels." },
            { q: "What is the best hook for Instagram reels?", a: "The best hook depends on your niche, but generally, curiosity-based hooks or 'how-to' hooks perform best. Reel hooks in hindi are also very effective for reaching the Indian audience." },
            { q: "How long should a reel hook be?", a: "A reel hook should be between 1 to 3 seconds. It needs to be punchy and provide immediate context to the viewer." }
          ].map((faq, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h4 className="font-bold mb-2">{faq.q}</h4>
              <p className="text-sm text-text-secondary">{faq.a}</p>
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
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm hover:bg-primary/10 hover:border-primary/30 transition-all"
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
  <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto space-y-8">
    <SEO title="About Us" description="Learn more about the team behind ReelHook AI and our mission to empower creators." />
    <h1 className="text-4xl font-bold font-display">Empowering the Next Generation of Creators</h1>
    <p className="text-lg text-text-secondary leading-relaxed">
      ReelHook AI was born out of a simple observation: content creation is hard, but the "hook" shouldn't be. 
      In a world of infinite scrolling, the first few seconds of your video determine its success.
    </p>
    <p className="text-lg text-text-secondary leading-relaxed">
      Our team of AI engineers and content strategists built ReelHook AI to level the playing field. 
      Whether you're a solo creator or a growing brand, we give you the tools to stop the scroll and share your message with the world.
    </p>
    <div className="grid grid-cols-2 gap-8 pt-8">
      <div className="text-center p-6 glass rounded-2xl">
        <div className="text-3xl font-bold text-primary mb-2">10k+</div>
        <div className="text-sm text-text-secondary">Active Creators</div>
      </div>
      <div className="text-center p-6 glass rounded-2xl">
        <div className="text-3xl font-bold text-primary mb-2">1M+</div>
        <div className="text-sm text-text-secondary">Hooks Generated</div>
      </div>
    </div>
  </div>
);

const Contact = () => (
  <div className="pt-32 pb-20 px-4 max-w-xl mx-auto space-y-8">
    <SEO title="Contact Us" description="Get in touch with the ReelHook AI team for support or inquiries." />
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold font-display">Get in Touch</h1>
      <p className="text-text-secondary">Have questions or feedback? We'd love to hear from you.</p>
    </div>
    <form className="glass p-8 rounded-3xl space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <input type="text" className="w-full bg-bg border border-white/10 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Your name" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <input type="email" className="w-full bg-bg border border-white/10 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50" placeholder="your@email.com" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Message</label>
        <textarea className="w-full bg-bg border border-white/10 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]" placeholder="How can we help?"></textarea>
      </div>
      <button type="button" className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all">
        Send Message
      </button>
    </form>
    <div className="flex justify-center space-x-8 text-text-secondary">
      <div className="flex items-center space-x-2">
        <Mail className="w-4 h-4" />
        <span className="text-sm">support@reelhook.ai</span>
      </div>
      <div className="flex items-center space-x-2">
        <Globe className="w-4 h-4" />
        <span className="text-sm">San Francisco, CA</span>
      </div>
    </div>
  </div>
);

const Legal = ({ title }: { title: string }) => (
  <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto space-y-8">
    <SEO title={title} description={`${title} for ReelHook AI.`} />
    <h1 className="text-4xl font-bold font-display">{title}</h1>
    <div className="prose prose-invert max-w-none text-text-secondary space-y-6">
      <p>Last updated: March 2024</p>
      <h2 className="text-white font-bold text-xl">1. Introduction</h2>
      <p>Welcome to ReelHook AI. These terms and conditions outline the rules and regulations for the use of our website and services.</p>
      <h2 className="text-white font-bold text-xl">2. Intellectual Property Rights</h2>
      <p>Other than the content you own, under these Terms, ReelHook AI and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
      <h2 className="text-white font-bold text-xl">3. Restrictions</h2>
      <p>You are specifically restricted from all of the following: publishing any Website material in any other media; selling, sublicensing and/or otherwise commercializing any Website material.</p>
    </div>
  </div>
);

const SEOIntro = () => (
  <section className="py-20 px-4 bg-bg">
    <div className="max-w-4xl mx-auto prose prose-invert prose-lg text-text-secondary">
      <h2 className="text-white text-3xl font-bold font-display mb-8">The Science of Viral Reel Hooks</h2>
      <p>
        In the fast-paced world of social media, attention is the most valuable currency. With millions of videos being uploaded every single day, creators are in a constant battle for the viewer's gaze. This is where the "hook" comes in. A hook is the first 1-3 seconds of your video that determines whether a user will stop scrolling or move on to the next piece of content.
      </p>
      <p>
        At ReelHook AI, we've spent thousands of hours analyzing viral content across Instagram, TikTok, and YouTube. We've discovered that viral hooks aren't just random luck; they follow specific psychological patterns. Our AI-powered generator is built on these principles, helping you craft opening lines that trigger curiosity, tap into FOMO (Fear Of Missing Out), or present a bold claim that demands an explanation.
      </p>
      <h3 className="text-white text-2xl font-bold mt-12 mb-6">Why Your Instagram Reels Need Better Hooks</h3>
      <p>
        Instagram's algorithm prioritizes retention. If users watch your video until the end, Instagram is more likely to push it to a wider audience on the Explore page. The hook is the gatekeeper of retention. Without a strong hook, your high-quality editing and valuable content will never be seen.
      </p>
      <p>
        Using a tool like ReelHook AI allows you to experiment with different content angles. For example, a fitness creator might use a "Relatable Pain" hook like "Why your morning run is actually making you tired," or a "Bold Claim" hook like "Stop doing crunches if you want abs." Both hooks create a curiosity gap that the viewer feels compelled to close by watching the rest of the video.
      </p>
      <h3 className="text-white text-2xl font-bold mt-12 mb-6">Optimizing for Different Languages and Tones</h3>
      <p>
        Cultural nuances play a huge role in content performance. A hook that works in English might not resonate the same way in Hindi or Hinglish. ReelHook AI supports multiple languages and tones, ensuring that your content feels authentic to your target audience. Whether you want to sound bold and authoritative or relatable and funny, our AI adapts to your brand voice.
      </p>
      <p>
        Beyond just hooks, our content suite provides captions, hashtags, and scripts. This holistic approach ensures that your entire post is optimized for engagement. From the first second to the final call to action, ReelHook AI is your partner in content growth.
      </p>
      <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl mt-12">
        <h4 className="text-white font-bold mb-4">Key Takeaways for Creators:</h4>
        <ul className="space-y-4">
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
            <span><strong>First 3 Seconds:</strong> This is your make-or-break window. Use pattern interrupts.</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
            <span><strong>Curiosity Gaps:</strong> Ask a question or make a claim that requires the video to answer.</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
            <span><strong>Consistency:</strong> Use ReelHook AI to maintain a high standard across all your posts.</span>
          </li>
        </ul>
      </div>

      <div className="mt-12 pt-12 border-t border-white/5">
        <h4 className="text-white font-bold mb-6">Explore Viral Hooks by Niche:</h4>
        <div className="flex flex-wrap gap-3">
          {NICHES.slice(0, 20).map(n => (
            <Link 
              key={n.id} 
              to={`/hooks/${n.id.toLowerCase()}-english`} 
              className="text-xs bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-all"
            >
              {n.name} Hooks
            </Link>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const BLOG_POSTS = [
  {
    id: "science-of-hooks",
    title: "The Science of Viral Reel Hooks",
    excerpt: "Why some hooks work and others don't. A deep dive into retention psychology.",
    date: "March 15, 2024",
    content: `
      In the fast-paced world of social media, attention is the most valuable currency. With millions of videos being uploaded every single day, creators are in a constant battle for the viewer's gaze. This is where the "hook" comes in. A hook is the first 1-3 seconds of your video that determines whether a user will stop scrolling or move on to the next piece of content.

      At ReelHook AI, we've spent thousands of hours analyzing viral content across Instagram, TikTok, and YouTube. We've discovered that viral hooks aren't just random luck; they follow specific psychological patterns. Our AI-powered generator is built on these principles, helping you craft opening lines that trigger curiosity, tap into FOMO (Fear Of Missing Out), or present a bold claim that demands an explanation.

      ### Why Your Instagram Reels Need Better Hooks
      Instagram's algorithm prioritizes retention. If users watch your video until the end, Instagram is more likely to push it to a wider audience on the Explore page. The hook is the gatekeeper of retention. Without a strong hook, your high-quality editing and valuable content will never be seen.
    `
  },
  {
    id: "instagram-algorithm-2024",
    title: "Instagram Algorithm Update 2024",
    excerpt: "What creators need to know about the latest changes to the Reels algorithm.",
    date: "March 10, 2024",
    content: "The 2024 algorithm update focuses heavily on original content and viewer satisfaction..."
  }
];

const Blog = () => (
  <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto space-y-12">
    <SEO title="Blog" description="Latest tips and strategies for viral content creation." />
    <div className="text-center space-y-4">
      <h1 className="text-4xl md:text-6xl font-bold font-display">Creator Insights</h1>
      <p className="text-xl text-text-secondary">Master the art of short-form video content.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {BLOG_POSTS.map(post => (
        <Link key={post.id} to={`/blog/${post.id}`} className="glass p-8 rounded-3xl border-white/5 hover:border-primary/30 transition-all group">
          <p className="text-xs text-primary font-bold mb-2">{post.date}</p>
          <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{post.title}</h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">{post.excerpt}</p>
          <div className="flex items-center text-sm font-bold text-white group-hover:translate-x-2 transition-transform">
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </Link>
      ))}
    </div>
  </div>
);

const BlogPost = () => {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === id);
  if (!post) return <div>Post not found</div>;

  return (
    <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto space-y-8">
      <SEO title={post.title} description={post.excerpt} />
      <Link to="/blog" className="text-text-secondary hover:text-white flex items-center space-x-2 text-sm">
        <ArrowRight className="w-4 h-4 rotate-180" />
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
  const [activeTab, setActiveTab] = useState<"hooks" | "ideas" | "improver" | "tools" | "logo" | "saved">("hooks");
  
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
              <p className="text-sm leading-relaxed pr-8">{c}</p>
              <CopyButton text={c} className="absolute top-4 right-4 text-text-secondary hover:text-white" />
            </div>
          ))}
        </div>
      );
    } else if (type === "hashtags") {
      content = (
        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 relative">
            <p className="text-primary font-mono text-sm leading-relaxed">{result.hashtags?.join(" ")}</p>
            <CopyButton text={result.hashtags?.join(" ") || ""} className="absolute top-4 right-4 text-text-secondary hover:text-white" />
          </div>
        </div>
      );
    } else if (type === "script") {
      content = (
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 relative">
          <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">{result.script}</pre>
          <CopyButton text={result.script || ""} className="absolute top-6 right-6 text-text-secondary hover:text-white" />
        </div>
      );
    } else if (type === "analyze") {
      content = (
        <div className="space-y-4">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Viral Potential</span>
              <span className={cn(
                "font-bold",
                result.score >= 90 ? "text-[#22C55E]" : result.score >= 75 ? "text-[#F59E0B]" : "text-[#EF4444]"
              )}>{result.score}%</span>
            </div>
            <p className="text-sm leading-relaxed">{result.explanation}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg p-3 rounded-lg border border-white/5">
                <p className="text-[10px] uppercase tracking-widest text-text-secondary mb-1">Trigger</p>
                <p className="text-xs font-bold">{result.trigger}</p>
              </div>
              <div className="bg-bg p-3 rounded-lg border border-white/5">
                <p className="text-[10px] uppercase tracking-widest text-text-secondary mb-1">Gap Strength</p>
                <p className="text-xs font-bold">{result.gapStrength}</p>
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
              <h4 className="font-bold text-primary">{a.title}</h4>
              <p className="text-xs text-text-secondary">{a.description}</p>
              <p className="text-xs italic text-white/60">Hook: {a.hook}</p>
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
                <p className="text-xs text-text-secondary mb-1">Best Day</p>
                <p className="font-bold text-primary">{result.bestDay}</p>
              </div>
              <div className="bg-bg p-4 rounded-xl border border-white/5 text-center">
                <p className="text-xs text-text-secondary mb-1">Best Time</p>
                <p className="font-bold text-primary">{result.bestTime}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold">Strategy Tip</p>
              <p className="text-xs text-text-secondary leading-relaxed">{result.strategy}</p>
            </div>
          </div>
        </div>
      );
    } else if (type === "calendar") {
      content = (
        <div className="space-y-4">
          {result.plan?.map((p: any, i: number) => (
            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start space-x-4">
              <div className="bg-primary/20 text-primary w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                D{i+1}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold">{p.topic}</p>
                <p className="text-xs text-text-secondary">{p.hookType}</p>
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

  const [logoPrompt, setLogoPrompt] = useState("");
  const [logoStyle, setLogoStyle] = useState("Minimalist");
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatedVideo, setAnimatedVideo] = useState<string | null>(null);

  const LOGO_STYLES = ["Minimalist", "Cyberpunk", "Vintage", "Corporate", "Playful", "Abstract"];

  const handleGenerateLogo = async () => {
    if (!logoPrompt) return;
    setIsGenerating(true);
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: { parts: [{ text: `Professional ${logoStyle.toLowerCase()} company logo for: ${logoPrompt}. High quality, vector style, clean background.` }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });
      
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setLogoImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error("Logo Error:", error);
    }
    setIsGenerating(false);
  };

  const handleAnimateLogo = async () => {
    if (!logoImage) return;
    
    // Check for API key selection for Veo models
    try {
      const aistudio = (window as any).aistudio;
      if (typeof window !== 'undefined' && aistudio) {
        const hasKey = await aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await aistudio.openSelectKey();
          // Proceed after dialog (assuming success as per guidelines)
        }
      }
    } catch (e) {
      console.error("Key selection error:", e);
    }

    setIsAnimating(true);
    try {
      // Create fresh instance to use the latest key
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      let operation = await ai.models.generateVideos({
        model: "veo-3.1-fast-generate-preview",
        prompt: "Smooth professional animation of this logo, cinematic lighting, 4k",
        image: {
          imageBytes: logoImage.split(",")[1],
          mimeType: "image/png"
        },
        config: { numberOfVideos: 1, resolution: "1080p", aspectRatio: "1:1" }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(downloadLink, {
          headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY || "" }
        });
        const blob = await response.blob();
        setAnimatedVideo(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error("Animation Error:", error);
    }
    setIsAnimating(false);
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
                  <label className="text-sm font-medium text-text-secondary">Niche / Category</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 text-text-secondary" />
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
                      className="w-full bg-bg border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
                                    className="w-full text-left px-8 py-1.5 text-xs text-text-secondary hover:text-white hover:bg-primary/10 transition-all"
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
                <div className="flex items-center space-x-2 text-xs text-text-secondary bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="font-bold text-primary">Selected:</span>
                  <span>{niche.name}</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>{sub}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Language</label>
                  <select 
                    className="w-full bg-bg border border-white/10 rounded-xl py-2 px-4 focus:ring-2 focus:ring-primary/50 outline-none"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                  >
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Tone</label>
                  <select 
                    className="w-full bg-bg border border-white/10 rounded-xl py-2 px-4 focus:ring-2 focus:ring-primary/50 outline-none"
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
            <h3 className="font-bold text-lg">Viral Content Suite</h3>
            <ul className="text-sm space-y-2 text-text-secondary">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Unlimited generations</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Access all viral hooks</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Caption & Hashtag generator</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tabs */}
          <div className="flex space-x-1 bg-white/5 p-1 rounded-xl overflow-x-auto custom-scrollbar">
            {(["hooks", "ideas", "improver", "tools", "logo", "saved"] as const).map((tab) => (
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
            ) : activeTab === "logo" ? (
              <div className="space-y-8 max-w-4xl mx-auto">
                <div className="text-center space-y-2 mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold font-display">Brand Identity Studio</h3>
                  <p className="text-text-secondary">Create a professional logo and bring it to life with cinematic animation.</p>
                </div>

                <div className="glass p-8 rounded-3xl space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-text-secondary">1. Describe your brand</label>
                    <textarea 
                      placeholder="e.g., A futuristic AI startup called 'Nexus' that focuses on speed and connectivity..."
                      className="w-full bg-bg border border-white/10 rounded-2xl p-4 min-h-[120px] focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                      value={logoPrompt}
                      onChange={(e) => setLogoPrompt(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-text-secondary">2. Select a style</label>
                    <div className="flex flex-wrap gap-2">
                      {LOGO_STYLES.map(style => (
                        <button
                          key={style}
                          onClick={() => setLogoStyle(style)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer",
                            logoStyle === style ? "bg-primary text-white" : "bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerateLogo}
                    disabled={isGenerating || !logoPrompt}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer transition-all hover:bg-primary/90 shadow-lg shadow-primary/20"
                  >
                    {isGenerating ? <RefreshCw className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    <span>{isGenerating ? "Designing your logo..." : "Generate Logo"}</span>
                  </button>
                </div>

                <AnimatePresence>
                  {logoImage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                      <div className="glass p-6 rounded-3xl space-y-6 flex flex-col">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold flex items-center space-x-2">
                            <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">3</span>
                            <span>Your Logo</span>
                          </h4>
                          <button onClick={() => {
                            const a = document.createElement('a');
                            a.href = logoImage;
                            a.download = 'logo.png';
                            a.click();
                          }} className="text-text-secondary hover:text-white transition-colors cursor-pointer">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex-1 bg-white/5 rounded-2xl p-4 flex items-center justify-center border border-white/10">
                          <img src={logoImage} alt="Generated Logo" className="w-full max-w-[240px] aspect-square rounded-xl shadow-2xl object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <button 
                          onClick={handleAnimateLogo}
                          disabled={isAnimating || animatedVideo !== null}
                          className="w-full bg-white text-bg py-4 rounded-xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer hover:bg-white/90 transition-all"
                        >
                          {isAnimating ? <RefreshCw className="animate-spin w-5 h-5" /> : <Zap className="w-5 h-5" />}
                          <span>{isAnimating ? "Animating..." : animatedVideo ? "Animation Complete" : "Animate Logo"}</span>
                        </button>
                      </div>

                      <div className="glass p-6 rounded-3xl space-y-6 flex flex-col">
                        <h4 className="font-bold flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-xs">4</span>
                          <span>Cinematic Animation</span>
                        </h4>
                        <div className="flex-1 bg-white/5 rounded-2xl flex items-center justify-center border border-dashed border-white/10 overflow-hidden relative min-h-[240px]">
                          {isAnimating ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-bg/50 backdrop-blur-sm z-10">
                              <RefreshCw className="animate-spin w-10 h-10 text-secondary" />
                              <p className="text-sm font-medium text-secondary animate-pulse">Rendering 4K Animation...</p>
                              <p className="text-xs text-text-secondary">This usually takes 1-2 minutes.</p>
                            </div>
                          ) : animatedVideo ? (
                            <video src={animatedVideo} controls autoPlay loop className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center space-y-3 p-6">
                              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                <Zap className="w-6 h-6 text-text-secondary" />
                              </div>
                              <p className="text-sm text-text-secondary">Click 'Animate Logo' to transform your static design into a cinematic video reveal.</p>
                            </div>
                          )}
                        </div>
                        {animatedVideo && (
                          <button onClick={() => {
                            const a = document.createElement('a');
                            a.href = animatedVideo;
                            a.download = 'logo-animation.mp4';
                            a.click();
                          }} className="w-full bg-secondary text-bg py-4 rounded-xl font-bold flex items-center justify-center space-x-2 cursor-pointer hover:bg-secondary/90 transition-all">
                            <Download className="w-5 h-5" />
                            <span>Download Video</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={
                <>
                  <SEO 
                    title="Viral Reel Hook Generator" 
                    description="Create high-converting Instagram Reel hooks, captions, and scripts in seconds with ReelHook AI." 
                    schema={{
                      "@context": "https://schema.org",
                      "@type": "SoftwareApplication",
                      "name": "ReelHook AI",
                      "operatingSystem": "Web",
                      "applicationCategory": "MultimediaApplication",
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
                    }}
                  />
                  <Hero />
                  <section id="features" className="py-20 px-4 bg-white/[0.02]">
                    <div className="max-w-7xl mx-auto">
                      <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold font-display">Everything you need to go viral</h2>
                        <p className="text-text-secondary max-w-2xl mx-auto">
                          Our AI-powered suite handles the hard part of content creation so you can focus on filming.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                          { icon: <Zap className="text-primary" />, title: "Viral Hooks", desc: "Stop the scroll with pattern-interrupting opening lines." },
                          { icon: <FileText className="text-primary" />, title: "Smart Captions", desc: "Engaging captions that drive comments and shares." },
                          { icon: <Hash className="text-primary" />, title: "Hashtag Packs", desc: "Optimized tags to reach your perfect audience." },
                          { icon: <BarChart3 className="text-primary" />, title: "Viral Scoring", desc: "Know your hook's potential before you post." },
                          { icon: <Lightbulb className="text-primary" />, title: "Idea Generator", desc: "Never run out of content ideas for your niche." },
                          { icon: <TrendingUp className="text-primary" />, title: "Content Strategy", desc: "Track what works and refine your strategy." }
                        ].map((f, i) => (
                          <div key={i} className="glass p-8 rounded-3xl border-white/5 hover:border-primary/30 transition-all group">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                              {f.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </>
              } />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Legal title="Privacy Policy" />} />
              <Route path="/terms" element={<Legal title="Terms of Service" />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/hooks/:slug" element={<ProgrammaticHooksPage />} />
            </Routes>
            <SEOIntro />
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

