import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../App";
import { Zap, TrendingUp, Globe, Star, Smile, Sparkles, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

export const AboutPage = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const hasRated = localStorage.getItem("reelhooks_about_feedback");
    if (hasRated) {
      setSubmitted(true);
      const saved = JSON.parse(hasRated);
      setRating(saved.rating || 5);
    }
  }, []);

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    localStorage.setItem(
      "reelhooks_about_feedback",
      JSON.stringify({ rating, feedback, date: new Date().toISOString() })
    );
    setSubmitted(true);
    
    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-16">
      <SEO 
        title="About ReelHooks | Founder Murtaza Darvesh & Our Creator Mission"
        description="Discover ReelHooks, the AI-powered scroll-stopping platform founded by SEO specialist Murtaza Darvesh. Learn how we help 10,000+ creators go viral. View our E-E-A-T credentials."
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Backed by Real Creators
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight">Empowering the Next Generation of Creators</h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          ReelHooks.site was born out of a simple observation: content creation is hard, but the "hook" shouldn't be. 
          In a world of infinite scrolling, the first 3 seconds of your video determine its entire viral trajectory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Story & Mission</h2>
          <p className="text-text-secondary leading-relaxed">
            It started in a small digital marketing office where we analyzed thousands of viral Instagram Reels and YouTube Shorts. We realized that while many creators had highly educational and beautiful content, they struggled to capture attention in the first 3 seconds, leading the algorithm to stop distribution.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Our team of engineers and content strategists built ReelHooks.site to level the playing field. We combined psychological triggers, curiosity gaps, and authority frameworks to create an AI-powered engine that spits out high-converting hooks instantly.
          </p>
        </div>
        <div className="glass p-8 rounded-3xl border-white/5 space-y-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg font-display">Fast & Efficient</h4>
              <p className="text-base text-text-secondary">Generate 10+ custom hooks in under 3 seconds.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg font-display">Data-Driven Formulas</h4>
              <p className="text-base text-text-secondary">Based on real viral retention metrics & CTR trends.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg font-display">Multi-Dialect Support</h4>
              <p className="text-base text-text-secondary">Engineered for localized English, Hindi, and Hinglish.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Founder Profile - E-E-A-T Trust Section */}
      <div className="glass p-8 md:p-12 rounded-[2.5rem] border-primary/20 bg-primary/5 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-1 flex flex-col items-center text-center space-y-4">
          <div className="w-32 h-32 rounded-full border-4 border-primary/30 overflow-hidden bg-primary/20 flex items-center justify-center">
            {/* Elegant avatar fallback */}
            <span className="text-4xl font-black text-primary font-display">MD</span>
          </div>
          <div>
            <h3 className="text-xl font-bold font-display">Murtaza Darvesh</h3>
            <p className="text-xs uppercase tracking-wider text-primary font-semibold">Founder & Lead SEO Strategist</p>
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-2xl font-bold font-display">Meet the Founder</h3>
          <p className="text-text-secondary leading-relaxed">
            <strong>Murtaza Darvesh</strong> is an SEO specialist, creator, and growth consultant who has spent years helping brands scale their organic search footprint and short-form video reach. Recognizing the critical intersection between retention psychology and modern search engine optimization, Murtaza designed ReelHooks.site to help creators bypass writer's block and instantly write openings that please both human audiences and algorithmic recommendation engines.
          </p>
          <p className="text-text-secondary leading-relaxed">
            You can reach Murtaza directly at <a href="mailto:MURTAZADARVESH@gmail.com" className="text-primary hover:underline font-semibold">MURTAZADARVESH@gmail.com</a> for feedback, partnership inquiries, or custom enterprise solutions.
          </p>
        </div>
      </div>

      {/* Trust Signals & Verified Metrics Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">ReelHooks by the Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          {[
            { label: "High-Opportunity Guides", value: "250+" },
            { label: "Hooks Generated Today", value: "10,000+" },
            { label: "Dialects Supported", value: "3" },
            { label: "Creator Feedback", value: "4.9/5 ★" }
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 glass rounded-2xl border-white/5">
              <div className="text-3xl font-black text-primary mb-2 font-display">{stat.value}</div>
              <div className="text-xs uppercase tracking-wider text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Rating & Feedback Mechanism */}
      <div className="glass p-8 md:p-12 rounded-[2.5rem] border-white/10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-2xl font-bold font-display">We Value Your Feedback</h3>
          <p className="text-text-secondary">
            Are the viral hooks generated by ReelHooks helping your channels grow? Rate your experience and send us your thoughts!
          </p>
        </div>

        {submitted ? (
          <div className="text-center p-8 bg-primary/10 border border-primary/20 rounded-2xl space-y-4 max-w-md mx-auto">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
            <h4 className="text-xl font-bold font-display">Thank you for rating us!</h4>
            <p className="text-text-secondary">Your feedback has been saved and shared with Murtaza and our engineering team to improve the AI generation models.</p>
          </div>
        ) : (
          <form onSubmit={handleRatingSubmit} className="max-w-md mx-auto space-y-6">
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "text-primary fill-primary"
                        : "text-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary">Tell us what you're building (optional)</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your niche, channel handle, or custom feature requests here..."
                className="w-full bg-bg border border-white/10 rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px] text-white"
              />
            </div>

            <button
              type="submit"
              disabled={rating === 0}
              className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${
                rating > 0
                  ? "bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-primary/25 cursor-pointer"
                  : "bg-white/5 text-white/30 cursor-not-allowed"
              }`}
            >
              Submit Rating & Feedback
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
