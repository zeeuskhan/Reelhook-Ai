import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  MessageSquare, 
  Hash, 
  FileText, 
  Lightbulb, 
  TrendingUp,
  Star,
  Award,
  Globe,
  ChevronDown
} from "lucide-react";
import { motion } from "motion/react";
import { TOOL_SEO_CONTENT } from '../data/toolSEOContent';
import FooterAd from './FooterAd';
import BannerAd from './BannerAd';

const ToolSEOPage: React.FC = () => {
  const location = useLocation();
  const slug = location.pathname.split('/').pop() || "";
  
  const content = useMemo(() => {
    if (!slug) return null;
    return TOOL_SEO_CONTENT[slug];
  }, [slug]);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Page Not Found</h1>
          <p className="text-text-secondary">The requested SEO page does not exist.</p>
          <Link to="/" className="btn-primary inline-flex items-center space-x-2">
            <span>Go Home</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": content.title,
    "operatingSystem": "Web",
    "applicationCategory": "MultimediaApplication",
    "url": `https://www.reelhooks.site/${content.slug}`,
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
    "mainEntity": content.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.reelhooks.site"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": content.title,
        "item": `https://www.reelhooks.site/${content.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Helmet>
        <title>{content.metaTitle} | ReelHooks.site</title>
        <meta name="description" content={content.metaDescription} />
        <link rel="canonical" href={`https://www.reelhooks.site/${content.slug}`} />
        <meta property="og:title" content={`${content.metaTitle} | ReelHooks.site`} />
        <meta property="og:description" content={content.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.reelhooks.site/${content.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${content.metaTitle} | ReelHooks.site`} />
        <meta name="twitter:description" content={content.metaDescription} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>Free AI Tool for Creators</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight leading-tight max-w-4xl mx-auto">
              {content.h1}
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {content.introduction}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/dashboard" className="btn-primary w-full sm:w-auto px-8 py-4 text-lg font-bold flex items-center justify-center space-x-2">
                <span>{content.ctaText}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <img 
                      key={i} 
                      src={`https://picsum.photos/seed/user${i}/100/100`} 
                      className="w-8 h-8 rounded-full border-2 border-background object-cover" 
                      alt="User"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ))}
                </div>
                <span>Joined by 10k+ creators</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <BannerAd />

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold font-display">{content.featuresTitle}</h2>
              <div className="space-y-6">
                {content.features.split('. ').map((feature, i) => (
                  feature.trim() && (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-text-secondary leading-relaxed">{feature.trim()}.</p>
                    </div>
                  )
                ))}
              </div>
            </div>
            <div className="glass p-8 rounded-3xl border-white/5 relative group">
              <div className="absolute -inset-4 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="relative space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">Viral Potential</h4>
                    <p className="text-xs text-text-secondary">Optimized for 2026 algorithm</p>
                  </div>
                </div>
                <div className="h-48 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="flex justify-center space-x-1">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                    </div>
                    <p className="text-sm font-medium">4.9/5 Rating</p>
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest">Based on 10,000+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-display">{content.guideTitle}</h2>
            <p className="text-text-secondary">Follow these simple steps to supercharge your Instagram presence.</p>
          </div>
          <div className="space-y-8">
            {content.guide.split('. ').map((step, i) => (
              step.trim() && (
                <div key={i} className="glass p-6 rounded-2xl border-white/5 flex items-start space-x-6">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-text-secondary leading-relaxed pt-2">{step.trim()}.</p>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Zap className="w-5 h-5" />, label: "Fast" },
                  { icon: <Globe className="w-5 h-5" />, label: "Global" },
                  { icon: <Award className="w-5 h-5" />, label: "Premium" },
                  { icon: <Star className="w-5 h-5" />, label: "Top Rated" }
                ].map((item, i) => (
                  <div key={i} className="glass p-6 rounded-2xl text-center space-y-2 border-white/5">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mx-auto text-primary">
                      {item.icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold font-display">{content.benefitsTitle}</h2>
              <p className="text-text-secondary leading-relaxed">{content.benefits}</p>
              <div className="pt-4">
                <h3 className="text-xl font-bold mb-4">Conclusion</h3>
                <p className="text-text-secondary leading-relaxed">{content.conclusion}</p>
              </div>
              <Link to="/dashboard" className="btn-primary inline-flex items-center space-x-2">
                <span>Start Growing Today</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-display">Frequently Asked Questions</h2>
            <p className="text-text-secondary">Everything you need to know about our {content.title}.</p>
          </div>
          <div className="space-y-4">
            {content.faqs.map((faq, i) => (
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

      {/* Internal Links */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h2 className="text-2xl font-bold font-display">Explore Other AI Tools</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.values(TOOL_SEO_CONTENT).filter(t => t.slug !== content.slug).map(tool => (
              <Link 
                key={tool.slug} 
                to={`/tools/${tool.slug}`}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium"
              >
                {tool.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FooterAd />
    </div>
  );
};

export default ToolSEOPage;
