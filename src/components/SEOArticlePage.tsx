import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowRight, 
  Zap, 
  ChevronDown,
  Star,
  TrendingUp,
  Award,
  Globe
} from "lucide-react";
import { motion } from "motion/react";
import { SEO_ARTICLES } from '../data/seoArticles';
import FooterAd from './FooterAd';
import BannerAd from './BannerAd';
import SkyscraperAd from './SkyscraperAd';

const SEOArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const article = useMemo(() => {
    if (!slug) return null;
    return SEO_ARTICLES[slug];
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Page Not Found</h1>
          <p className="text-text-secondary">The requested SEO article does not exist.</p>
          <Link to="/" className="btn-primary inline-flex items-center space-x-2">
            <span>Go Home</span>
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
        "name": "Blog",
        "item": "https://www.reelhooks.site/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `https://www.reelhooks.site/${article.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Helmet>
        <title>{article.metaTitle} | ReelHooks.site</title>
        <meta name="description" content={article.metaDescription} />
        <meta name="keywords" content={article.keywords.join(', ')} />
        <link rel="canonical" href={`https://www.reelhooks.site/${article.slug}`} />
        <meta property="og:title" content={article.metaTitle} />
        <meta property="og:description" content={article.metaDescription} />
        <meta property="og:url" content={`https://www.reelhooks.site/${article.slug}`} />
        <script type="application/ld+json">{JSON.stringify(article.schema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-base font-medium">
              <Zap className="w-5 h-5" />
              <span>Free AI Creator Tool</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight leading-tight">
              {article.h1}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-base text-text-secondary">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">4.9/5 Rating</span>
              </div>
              <span>•</span>
              <span>10k+ Happy Creators</span>
            </div>
          </motion.div>
        </div>
      </section>

      <BannerAd />
      <SkyscraperAd />

      {/* Breadcrumbs */}
      <nav className="max-w-4xl mx-auto px-4 py-8 flex items-center space-x-2 text-sm text-text-secondary overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/blog" className="hover:text-primary transition-colors">Guides</Link>
        <span>/</span>
        <span className="text-white font-medium truncate">{article.title}</span>
      </nav>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-invert prose-primary max-w-none 
              prose-headings:font-display prose-headings:font-bold 
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-primary
              prose-p:text-text-secondary prose-p:leading-relaxed prose-p:mb-6
              prose-li:text-text-secondary prose-li:mb-2
              prose-strong:text-white
              [&_.example-box]:bg-white/5 [&_.example-box]:p-8 [&_.example-box]:rounded-3xl [&_.example-box]:border [&_.example-box]:border-white/10 [&_.example-box]:my-8
              [&_.example-box.warning]:border-yellow-500/20 [&_.example-box.warning]:bg-yellow-500/5
              [&_table]:w-full [&_table]:border-collapse [&_table]:my-8
              [&_th]:bg-primary/20 [&_th]:p-4 [&_th]:text-left [&_th]:border [&_th]:border-white/10
              [&_td]:p-4 [&_td]:border [&_td]:border-white/10
              [&_.highlight-green]:text-green-400 [&_.highlight-green]:font-bold"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-display">Frequently Asked Questions</h2>
            <p className="text-text-secondary">Everything you need to know about {article.title}.</p>
          </div>
          <div className="space-y-4">
            {article.faqs.map((faq, i) => (
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

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass p-12 rounded-[3rem] border-primary/20 space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10" />
            <h2 className="text-3xl md:text-5xl font-bold font-display">Ab Intezar Kis Baat Ka? Aag Laga Do!</h2>
            <p className="text-xl text-text-secondary">Abhi generate karo apne viral captions aur hooks.</p>
            <Link to="/dashboard" className="btn-primary inline-flex items-center space-x-2 px-10 py-4 text-lg font-bold">
              <span>Go to Dashboard 🚀</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Internal Links Hub */}
      <section className="py-12 border-t border-white/5 bg-accent/5">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <h2 className="text-3xl font-bold font-display uppercase italic text-primary">Creator Growth Network</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
            {Object.values(SEO_ARTICLES).map(a => (
              <Link 
                key={a.slug} 
                to={`/${a.slug}`}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-bold flex items-center justify-center text-center"
              >
                {a.title.split(':')[0]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <p className="text-center py-10 text-sm text-text-secondary">
        Powered by ReelHooks.site – India’s #1 Free AI Tool for Viral Reels
      </p>

      <FooterAd />
    </div>
  );
};

export default SEOArticlePage;
