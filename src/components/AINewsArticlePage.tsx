import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Zap, 
  Calendar, 
  User, 
  Clock, 
  ChevronDown,
  Share2,
  Bookmark
} from "lucide-react";
import { motion } from "motion/react";
import { AI_NEWS_ARTICLES } from '../data/aiNewsArticles';
import { SEO } from '../App';
import FooterAd from './FooterAd';
import BannerAd from './BannerAd';

const AINewsArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const article = useMemo(() => {
    if (!slug) return null;
    return AI_NEWS_ARTICLES[slug];
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold font-display">Article Not Found</h1>
          <p className="text-text-secondary max-w-md mx-auto">The news article you are looking for might have been moved or doesn't exist.</p>
          <Link to="/ai-tools-news" className="btn-primary inline-flex items-center space-x-2 px-8 py-3">
            <span>See Latest News</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.h1,
    "image": [article.image],
    "datePublished": article.date,
    "author": [{
      "@type": "Person",
      "name": article.author,
      "url": "https://www.reelhooks.site/about"
    }]
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <SEO 
        title={article.metaTitle}
        description={article.metaDescription}
        image={article.image}
        type="article"
        schema={[articleSchema, faqSchema]}
      />

      {/* Hero Header */}
      <section className="relative pt-40 pb-20 px-4">
        <div className="absolute inset-0 max-h-[800px] pointer-events-none">
          <img src={article.image} alt="" className="w-full h-full object-cover opacity-10 blur-2xl scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10 space-y-12">
          <div className="space-y-6 text-center md:text-left">
            <Link 
              to={`/ai-tools-news/${article.category}`} 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest"
            >
              <Zap className="w-3 h-3" />
              <span>{article.category.replace('-', ' ')}</span>
            </Link>
            
            <h1 className="text-4xl md:text-7xl font-black font-display tracking-tight leading-[0.95] uppercase">
              {article.h1}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-sm text-text-secondary font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {article.author[0]}
                </div>
                <span>By {article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Published on {article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>12 min read</span>
              </div>
            </div>
          </div>

          <div className="aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <BannerAd />

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Left: Shares/Tools */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 flex flex-col items-center space-y-6">
              <button className="w-12 h-12 rounded-2xl glass border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-2xl glass border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Article Body */}
          <div className="lg:col-span-8">
            <div 
              className="prose prose-invert prose-primary max-w-none 
                prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
                prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:text-primary
                prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4 prose-h3:text-white
                prose-p:text-text-secondary prose-p:text-lg prose-p:leading-[1.7] prose-p:mb-8
                prose-li:text-text-secondary prose-li:text-lg prose-li:mb-3
                prose-strong:text-white prose-strong:font-black
                [&_.example-box]:bg-white/5 [&_.example-box]:p-8 [&_.example-box]:rounded-3xl [&_.example-box]:border [&_.example-box]:border-white/10 [&_.example-box]:my-12
                [&_.example-box.warning]:border-primary/30 [&_.example-box.warning]:bg-primary/5
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-12 [&_table]:glass [&_table]:rounded-3xl [&_table]:overflow-hidden
                [&_th]:bg-primary/20 [&_th]:p-6 [&_th]:text-left [&_th]:border-b [&_th]:border-white/10 [&_th]:text-primary [&_th]:font-black [&_th]:uppercase [&_th]:tracking-widest [&_th]:text-xs
                [&_td]:p-6 [&_td]:border-b [&_td]:border-white/5 [&_td]:text-text-secondary [&_td]:text-sm"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Related Tools Box */}
            <div className="mt-20 p-12 glass rounded-[3rem] border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                <Zap className="w-40 h-40 text-primary shrink-0" />
              </div>
              <div className="relative space-y-6">
                <h3 className="text-3xl font-black font-display uppercase italic">Improve Your Reels Today</h3>
                <p className="text-text-secondary">Read about AI tools? Use them to grow your brand. Our free suite is ready for you.</p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/free-ai-hook-generator" className="btn-primary px-8 py-3 rounded-2xl flex items-center gap-2">
                    <span>Hook Generator</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/reel-hook-analyzer" className="glass px-8 py-3 rounded-2xl border-white/20 hover:border-primary/40 text-white flex items-center gap-2">
                    <span>Hook Analyzer</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Right: Trending */}
          <div className="lg:col-span-3 space-y-12">
            <div className="space-y-6">
              <h4 className="text-xl font-bold font-display uppercase tracking-widest border-b border-white/10 pb-4">Trending Now</h4>
              <div className="space-y-8">
                {Object.values(AI_NEWS_ARTICLES).slice(0, 3).map((a) => (
                  <Link key={a.slug} to={`/ai-tools-news/${a.category}/${a.slug}`} className="group block space-y-3">
                    <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
                      <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <h5 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors">{a.title}</h5>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/20 space-y-4">
              <h4 className="text-lg font-bold">New Tool Tips?</h4>
              <p className="text-xs text-text-secondary">Found a new AI tool? Send it to our editorial team and get featured.</p>
              <Link to="/contact" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                Submit Tool <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-accent/5">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tighter italic">Deep Dive <span className="text-primary font-outline">Q&A</span></h2>
            <p className="text-text-secondary">Bhai, confusing lag raha hai? Humne answers ready rakhe hain.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {article.faqs.map((faq, i) => (
              <details key={i} className="glass rounded-3xl border-white/5 group overflow-hidden">
                <summary className="p-8 cursor-pointer flex items-center justify-between list-none">
                  <h3 className="text-lg font-black uppercase tracking-tight pr-4">{faq.q}</h3>
                  <ChevronDown className="w-6 h-6 text-primary group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-8 pb-8 text-text-secondary leading-relaxed text-base">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <FooterAd />
    </div>
  );
};

export default AINewsArticlePage;
