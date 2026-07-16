import React from "react";
import { Link } from "react-router-dom";
import { SEO } from "../App";
import { NICHES } from "../data/niches";
import { SEO_ARTICLES } from "../data/seoArticles";
import { Map, FileText, Compass, Sparkles, Flame, BookOpen } from "lucide-react";

export const SitemapPage = () => {
  const corePages = [
    { path: "/", title: "ReelHooks.site – Free AI Hook Generator & Creator Platform" },
    { path: "/explore", title: "Explore All Niche Reel Hook Categories" },
    { path: "/about", title: "About ReelHooks: Meet Founder Murtaza Darvesh & Our Mission" },
    { path: "/faq", title: "Frequently Asked Questions about Viral Reels" },
    { path: "/contact", title: "Contact Support, Feedback & Brand Partnerships" },
    { path: "/privacy", title: "Privacy Policy – ReelHooks Data Protection" },
    { path: "/terms", title: "Terms of Service – Creator Platform Guidelines" },
    { path: "/blog", title: "ReelHooks AI Video Marketing Blog" }
  ];

  const blogPosts = [
    { path: "/blog/best-instagram-reels-hooks-2026", title: "Ultimate Guide to Best Instagram Reel Hooks in 2026" },
    { path: "/blog/how-to-go-viral-on-tiktok-2026", title: "How to Go Viral on TikTok 2026: AI Content Strategy" }
  ];

  const tools = [
    { path: "/tools/instagram-bio-generator", title: "AI Instagram Bio Generator (with Hinglish support)" },
    { path: "/tools/instagram-caption-generator", title: "AI Instagram Caption Generator (boost engagement)" },
    { path: "/tools/instagram-hashtag-generator", title: "AI Instagram Hashtag Generator (viral 2026 tags)" },
    { path: "/tools/instagram-reel-generator", title: "AI Instagram Reel Script Writer (full script outlines)" },
    { path: "/tools/instagram-username-generator", title: "AI Instagram Username Generator (aesthetic & unique)" },
    { path: "/tools/instagram-dp-generator", title: "AI Instagram Profile Picture (DP) Maker" },
    { path: "/tools/instagram-transcript-generator", title: "AI Instagram Transcript Generator (video to text)" },
    { path: "/tools/instagram-mockup-generator", title: "AI Instagram Feed & Post Mockup Planner" },
    { path: "/tools/hook-generator", title: "Free AI Hook Generator & Hook Formulas" }
  ];

  const premiumArticlesList = [
    "best-hooks-for-instagram-reels",
    "viral-hooks-for-instagram-reels",
    "how-to-go-viral-on-reels-2026",
    "best-time-to-post-reels-india",
    "how-to-get-first-1000-followers-instagram",
    "instagram-algorithm-explained-2026",
    "how-to-use-ai-for-content-creation",
    "monetize-instagram-reels-india",
    "increase-reel-engagement-hacks",
    "faceless-reel-channel-guide",
    "instagram-seo-tips-for-creators",
    "reel-hook-analyzer",
    "content-ideas-generator",
    "content-calendar-generator",
    "free-ai-hook-generator"
  ];

  const premiumArticles = premiumArticlesList.map(slug => {
    const article = SEO_ARTICLES[slug];
    return {
      path: `/${slug}`,
      title: article ? (article.metaTitle || article.title) : `Guide to ${slug.replace(/-/g, ' ')}`
    };
  });

  return (
    <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto space-y-16">
      <SEO 
        title="HTML Sitemap | Browse All Creator Tools & Viral Niche Guides"
        description="Navigate all high-priority creator resources, AI generators, and viral niche hook pillar pages on ReelHooks.site. Find everything you need in one place."
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.reelhooks.site/" },
            { "@type": "ListItem", "position": 2, "name": "Sitemap", "item": "https://www.reelhooks.site/sitemap" }
          ]
        }}
      />

      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest">
          <Map className="w-3.5 h-3.5" />
          Site Map Directory
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-display leading-tight">Explore ReelHooks</h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Quickly navigate to all our core tools, localized niche libraries, and viral growth articles designed to help content creators scale organically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Pages & Navigation */}
        <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <Compass className="w-5 h-5" />
            <h2 className="text-2xl font-bold font-display">Core Platform Pages</h2>
          </div>
          <ul className="space-y-4">
            {corePages.map((page, idx) => (
              <li key={idx} className="border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                <Link to={page.path} className="text-text-secondary hover:text-primary transition-colors text-sm font-medium flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{page.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Free Creator Tools */}
        <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-2xl font-bold font-display">Free Creator AI Tools</h2>
          </div>
          <ul className="space-y-4">
            {tools.map((tool, idx) => (
              <li key={idx} className="border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                <Link to={tool.path} className="text-text-secondary hover:text-primary transition-colors text-sm font-medium flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{tool.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Premium Articles & Guides */}
        <div className="glass p-8 rounded-3xl border-white/5 space-y-6 md:col-span-2">
          <div className="flex items-center gap-3 text-primary">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-2xl font-bold font-display">Premium Organic Growth Guides</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {premiumArticles.map((article, idx) => (
              <div key={idx} className="border-b border-white/5 pb-3 md:border-b-0 md:pb-0 flex items-start gap-2">
                <Link to={article.path} className="text-text-secondary hover:text-primary transition-colors text-sm font-medium flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{article.title}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Niche Pillar Guides */}
        <div className="glass p-8 rounded-3xl border-white/5 space-y-6 md:col-span-2">
          <div className="flex items-center gap-3 text-primary">
            <Flame className="w-5 h-5" />
            <h2 className="text-2xl font-bold font-display">Viral Niche Pillar Guides</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {NICHES.map((niche) => (
              <div key={niche.id} className="flex items-start gap-2">
                <Link to={`/hooks/${niche.id.toLowerCase()}`} className="text-text-secondary hover:text-primary transition-colors text-sm font-medium flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{niche.name} Reel Hooks Pillar Guide</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Blog Posts */}
        <div className="glass p-8 rounded-3xl border-white/5 space-y-6 md:col-span-2">
          <div className="flex items-center gap-3 text-primary">
            <FileText className="w-5 h-5" />
            <h2 className="text-2xl font-bold font-display">Strategy Blog Library</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogPosts.map((post, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Link to={post.path} className="text-text-secondary hover:text-primary transition-colors text-sm font-medium flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{post.title}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
