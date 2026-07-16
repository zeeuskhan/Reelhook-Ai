import React from "react";
import { Link } from "react-router-dom";
import { SEO } from "../App";
import { NICHES } from "../data/niches";
import { Zap, Sparkles, TrendingUp, Rocket, ArrowRight } from "lucide-react";

export const ExplorePage = () => {
  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto space-y-16">
      <SEO 
        title="Explore Viral Reel Hook Niches | Find Your Perfect Content Hook"
        description="Explore 100+ viral reel hook niches to find your perfect content angle. From Finance to Fitness, discover what works in 2026. Start browsing and go viral today!"
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
        <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight">Explore All Categories</h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Find the perfect viral hooks for your specific niche. We cover over 50+ categories and hundreds of subcategories, fine-tuned for high retention.
        </p>
      </div>

      {/* Strategic Tools Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Hook Analyzer", desc: "Test your hooks for viral potential.", icon: <Zap className="w-5 h-5" />, slug: "reel-hook-analyzer" },
          { title: "Content Ideas", desc: "Never run out of what to post.", icon: <Sparkles className="w-5 h-5" />, slug: "content-ideas-generator" },
          { title: "Posting Times", desc: "Find peak engagement IST hours.", icon: <TrendingUp className="w-5 h-5" />, slug: "best-time-to-post-reels" },
          { title: "Content Calendar", desc: "Plan 30 days in 10 minutes.", icon: <Rocket className="w-5 h-5" />, slug: "content-calendar-generator" }
        ].map((tool, i) => (
          <Link key={i} to={`/${tool.slug}`} className="glass p-6 rounded-3xl border-primary/20 bg-primary/5 hover:border-primary/40 transition-all group flex flex-col space-y-3 hover:scale-102">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
              {tool.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg font-display">{tool.title}</h3>
              <p className="text-sm text-text-secondary">{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Niche Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {NICHES.map(n => (
          <div key={n.id} className="glass p-8 rounded-3xl border-white/5 space-y-6 hover:border-primary/30 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors font-display">{n.name}</h3>
                <Link to={`/hooks/${n.id.toLowerCase()}`} className="text-primary hover:underline text-sm font-bold flex items-center">
                  <span>Pillar Guide</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {n.subcategories.slice(0, 8).map(s => (
                  <span key={s} className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 bg-white/5 rounded-full text-text-secondary border border-white/10">
                    {s}
                  </span>
                ))}
                {n.subcategories.length > 8 && (
                  <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 text-text-secondary">
                    +{n.subcategories.length - 8} more
                  </span>
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/5 flex flex-col space-y-2">
              <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Localized Clusters:</p>
              <div className="flex gap-2">
                <Link to={`/hooks/${n.id.toLowerCase()}-english`} className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-white transition-colors border border-white/10">English</Link>
                <Link to={`/hooks/${n.id.toLowerCase()}-hindi`} className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-white transition-colors border border-white/10">हिंदी</Link>
                <Link to={`/hooks/${n.id.toLowerCase()}-hinglish`} className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-white transition-colors border border-white/10">Hinglish</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 border border-primary/20 p-12 rounded-[3rem] text-center space-y-6">
        <h2 className="text-3xl font-bold font-display">Can't find your niche?</h2>
        <p className="text-text-secondary max-w-xl mx-auto leading-relaxed">
          Our AI can generate hooks for ANY niche, even if it is not listed here. Just head to the dashboard and type in your specific topic.
        </p>
        <Link to="/dashboard" className="bg-primary text-white px-10 py-4 rounded-full font-bold inline-block hover:scale-105 transition-all shadow-xl shadow-primary/25">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};
