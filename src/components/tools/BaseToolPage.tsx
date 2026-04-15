import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle2, 
  Zap, 
  Copy,
  RefreshCw,
  ChevronDown,
  Star,
  TrendingUp,
  Globe,
  Award
} from "lucide-react";
import { motion } from "motion/react";
import { TOOL_SEO_CONTENT } from '../../data/toolSEOContent';
import { generateExtraAI } from '../../services/ai';
import FooterAd from '../FooterAd';
import BannerAd from '../BannerAd';
import SkyscraperAd from '../SkyscraperAd';

interface BaseToolPageProps {
  slug: string;
  toolType: string;
  inputLabel: string;
  inputPlaceholder: string;
  buttonText: string;
  resultKey: string;
  customPrompt?: string;
}

const BaseToolPage: React.FC<BaseToolPageProps> = ({
  slug,
  toolType,
  inputLabel,
  inputPlaceholder,
  buttonText,
  resultKey,
}) => {
  const content = TOOL_SEO_CONTENT[slug];
  const [input, setInput] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!input) return;
    setIsGenerating(true);
    try {
      const res = await generateExtraAI(toolType, input);
      const data = res[resultKey] || (res.result ? [res.result] : []);
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!content) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": content.title,
    "operatingSystem": "Web",
    "applicationCategory": "MultimediaApplication",
    "url": `https://www.reelhooks.site/tools/${content.slug}`,
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "10000" }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Helmet>
        <title>{content.metaTitle} | ReelHooks.site</title>
        <meta name="description" content={content.metaDescription} />
        <link rel="canonical" href={`https://www.reelhooks.site/tools/${content.slug}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight leading-tight max-w-4xl mx-auto">
              {content.h1}
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {content.introduction}
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto glass p-8 rounded-3xl border-white/10 space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-sm font-bold uppercase tracking-widest text-text-secondary">{inputLabel}</label>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inputPlaceholder}
                className="w-full bg-bg border border-white/10 rounded-2xl p-4 min-h-[120px] focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !input}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg shadow-primary/25"
            >
              {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              <span>{isGenerating ? "Generating..." : buttonText}</span>
            </button>

            {results.length > 0 && (
              <div className="space-y-4 pt-4">
                {results.map((res, i) => {
                  const text = typeof res === 'string' ? res : JSON.stringify(res, null, 2);
                  return (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl text-left relative group">
                      <p className="text-base leading-relaxed pr-10 whitespace-pre-wrap">{text}</p>
                      <button 
                        onClick={() => copyToClipboard(text, i)}
                        className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
                      >
                        {copiedIndex === i ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <BannerAd />
      <SkyscraperAd />

      {/* SEO Content Sections */}
      <section className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold font-display">{content.featuresTitle}</h2>
            <div className="space-y-6">
              {content.features.split('. ').map((f, i) => f.trim() && (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-text-secondary leading-relaxed">{f.trim()}.</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center"><TrendingUp className="text-primary" /></div>
              <div><h4 className="font-bold text-lg">Viral Potential</h4><p className="text-sm text-text-secondary">Optimized for 2026 algorithm</p></div>
            </div>
            <div className="h-40 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="flex justify-center space-x-1 mb-2">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="font-bold">4.9/5 User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-center">{content.guideTitle}</h2>
          <div className="space-y-6">
            {content.guide.split('. ').map((step, i) => step.trim() && (
              <div key={i} className="glass p-6 rounded-2xl flex items-start space-x-6">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{i+1}</div>
                <p className="text-text-secondary leading-relaxed pt-2">{step.trim()}.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-display">{content.benefitsTitle}</h2>
            <p className="text-text-secondary leading-relaxed">{content.benefits}</p>
            <div className="pt-4">
              <h3 className="text-xl font-bold mb-4">Conclusion</h3>
              <p className="text-text-secondary leading-relaxed">{content.conclusion}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[{icon: <Zap/>, label: "Fast"}, {icon: <Globe/>, label: "Global"}, {icon: <Award/>, label: "Premium"}, {icon: <Star/>, label: "Top Rated"}].map((item, i) => (
              <div key={i} className="glass p-6 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mx-auto text-primary">{item.icon}</div>
                <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {content.faqs.map((faq, i) => (
              <details key={i} className="glass rounded-2xl border-white/5 group overflow-hidden">
                <summary className="p-6 cursor-pointer flex items-center justify-between list-none">
                  <h3 className="font-bold pr-4">{faq.q}</h3>
                  <ChevronDown className="w-5 h-5 text-text-secondary group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-text-secondary leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <FooterAd />
    </div>
  );
};

export default BaseToolPage;
