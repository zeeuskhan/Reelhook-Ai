import React from 'react';
import { 
  Dumbbell, 
  Briefcase, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Heart, 
  Gamepad2, 
  Cpu, 
  BookOpen, 
  Camera, 
  DollarSign, 
  User,
  Coffee
} from "lucide-react";

export interface TemplateCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  templates: string[];
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: "fitness",
    name: "Fitness",
    icon: <Dumbbell className="w-5 h-5" />,
    templates: [
      "Stop doing squats like this if you want to grow your glutes.",
      "How I lost 10kg in 3 months without giving up pizza.",
      "The exact 15-minute workout that fixed my back pain.",
      "Why your morning chai might be killing your weight loss.",
      "3 gym mistakes every beginner makes (and how to fix them).",
      "I tried every viral fitness hack so you don't have to.",
      "If you're still doing cardio for weight loss, watch this.",
      "The #1 reason you aren't seeing results in the gym."
    ]
  },
  {
    id: "business",
    name: "Business",
    icon: <Briefcase className="w-5 h-5" />,
    templates: [
      "The secret tool 7-figure startups use to automate everything.",
      "How to get 10 hours of work done in just 2 hours.",
      "The brutal truth about being a solopreneur no one tells you.",
      "3 networking hacks that helped me land high-ticket clients.",
      "How I made my first $1,000 online using only free AI tools.",
      "Stop trading your time for money. Do this instead.",
      "The biggest mistake I made when starting my online business.",
      "How to build a personal brand that attracts opportunities."
    ]
  },
  {
    id: "motivation",
    name: "Motivation",
    icon: <Sparkles className="w-5 h-5" />,
    templates: [
      "I wish I knew this about success when I first started.",
      "Stop scrolling! If you're feeling lost in life, watch this.",
      "The 5 AM habit that changed my life in 30 days.",
      "How to overcome procrastination using the 2-minute rule.",
      "What they don't teach you in school about mindset.",
      "If you're waiting for the perfect time, it's never coming.",
      "How I went from broke to abundant in just 1 year.",
      "The secret to staying disciplined when you have no motivation."
    ]
  },
  {
    id: "ai",
    name: "AI Tools",
    icon: <Cpu className="w-5 h-5" />,
    templates: [
      "Stop using ChatGPT like this. Use these 3 prompts instead.",
      "3 AI tools that feel illegal to know in 2026.",
      "How I built a full website in 10 minutes using only AI.",
      "AI is changing everything. Here's how to stay ahead.",
      "The best AI video tools that will save you hours of editing.",
      "How to use AI to automate your entire social media.",
      "This new AI tool is going to replace your boring job.",
      "10 AI prompts that will make you look like a genius."
    ]
  },
  {
    id: "faceless",
    name: "Faceless Videos",
    icon: <Target className="w-5 h-5" />,
    templates: [
      "How I make $5k/month with faceless social media accounts.",
      "3 faceless reel niches that are blowing up right now.",
      "The best AI voiceovers for your faceless videos.",
      "How to find unlimited b-roll for your faceless content.",
      "Stop showing your face! Do this instead for viral growth.",
      "The secret to building a faceless brand in 2026.",
      "My exact workflow for creating 30 faceless reels in 1 hour.",
      "Faceless video ideas that have 100% viral potential."
    ]
  },
  {
    id: "finance",
    name: "Finance",
    icon: <DollarSign className="w-5 h-5" />,
    templates: [
      "The only 3 stocks you need to hold for the next 10 years.",
      "How to retire at 35 with just 10k monthly investment.",
      "3 websites that pay you daily for doing absolutely nothing.",
      "Stop saving money. Start investing it like this.",
      "How I saved $10,000 in one year on a entry-level salary.",
      "The biggest investment mistake I made in my 20s.",
      "How to get your first credit card and build a 800 score.",
      "Passive income ideas that actually work in 2026."
    ]
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: <Gamepad2 className="w-5 h-5" />,
    templates: [
      "The hidden setting in Warzone that gives you literal aimbot.",
      "How to go from Bronze to Diamond in just one weekend.",
      "3 gaming myths that are actually true.",
      "The best budget PC build for 4K gaming in 2026.",
      "How I won a $1,000 tournament with zero practice.",
      "Stop using these weapons! They are stealing your kills.",
      "The most emotional moment in gaming history.",
      "How to stream on Twitch with zero viewers and grow fast."
    ]
  },
  {
    id: "tech",
    name: "Tech Reviews",
    icon: <Cpu className="w-5 h-5" />,
    templates: [
      "iPhone 17 vs Samsung S26: The honest truth.",
      "I bought the cheapest laptop on Amazon so you don't have to.",
      "3 iPhone settings you need to change right now.",
      "The best headphones for 2026 that no one is talking about.",
      "Why I'm finally switching from Mac to Windows.",
      "The future of tech is here and it's not what you think.",
      "How to speed up your old PC in just 5 minutes.",
      "The most useless piece of tech I've ever bought."
    ]
  },
  {
    id: "personal-branding",
    name: "Personal Branding",
    icon: <User className="w-5 h-5" />,
    templates: [
      "How to look professional on camera with zero equipment.",
      "The #1 mistake people make with their LinkedIn profile.",
      "How I grew my following from 0 to 10k in 90 days.",
      "Your story is your superpower. Here's how to tell it.",
      "How to build authority in your niche without being an expert.",
      "The secret to staying consistent when no one is watching.",
      "How to get invited to podcasts and speaking events.",
      "Stop being a carbon copy! Build an authentic brand."
    ]
  }
];
