import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Zap, 
  ArrowRight, 
  Calendar, 
  User, 
  Filter,
  Newspaper,
  ChevronRight,
  Search
} from "lucide-react";
import { AI_NEWS_ARTICLES } from '../data/aiNewsArticles';
import { SEO } from '../App'; // Assuming SEO is exported from App.tsx or similar

const CATEGORIES = [
  { 
    id: 'all', 
    name: 'All News',
    title: 'Daily AI Tools News 2026 | Scale Your Brand Faster with AI',
    description: 'Get real-time updates on new AI tools, industry breakthroughs, and trending growth hacks. Stay ahead of the competition with the latest AI news. Read today!'
  },
  { 
    id: 'latest-ai-tools', 
    name: 'Latest Tools',
    title: 'Top New AI Tools April 2026 | Boost Your Content ROI Instantly',
    description: 'Discover the absolute newest AI tools of 2026. We review trending AI software helping creators save hours of work. See what\'s working—try them now!'
  },
  { 
    id: 'ai-tool-launch', 
    name: 'Launches',
    title: 'Upcoming AI Tool Launches 2026 | Be the First to Dominate Your Niche',
    description: 'Be the first to see the latest AI tool launches of 2026. Exclusive reviews and strategic breakdowns of new AI tech. Gain an unfair advantage—get early access!'
  },
  { 
    id: 'ai-updates', 
    name: 'Updates',
    title: 'Weekly AI Software Updates 2026 | Master New Algorithm Secrets Today',
    description: 'Don\'t miss critical AI software updates. From SearchGPT to VideoGPT-5, we break down every new feature you need to grow your social media. Read the updates!'
  },
  { 
    id: 'free-ai-tools', 
    name: 'Free Tools',
    title: '100% Free AI Creator Tools 2026 | Build Your Business for $0',
    description: 'Stop paying for expensive software. Discover the best free AI tools for creators in 2026. Handpicked list of powerful no-code AI tools. Scale for free!'
  }
];

const AINewsIndex: React.FC = () => {
  const { category = 'all' } = useParams<{ category: string }>();

  const filteredArticles = useMemo(() => {
    const articles = Object.values(AI_NEWS_ARTICLES);
    if (category === 'all') return articles;
    return articles.filter(a => a.category === category);
  }, [category]);

  const activeCategory = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <SEO 
        title={activeCategory.title}
        description={activeCategory.description}
      />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold uppercase tracking-widest text-sm"
          >
            <Newspaper className="w-4 h-4" />
            <span>AI Innovation Hub</span>
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-black font-display uppercase tracking-tight">
            AI Tools <span className="text-primary font-outline">News</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Bhai, stay ahead of the curve. Weekly updates on the only AI tools that actually matter in 2026.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={cat.id === 'all' ? '/ai-tools-news' : `/ai-tools-news/${cat.id}`}
              className={`px-6 py-3 rounded-2xl border transition-all font-bold text-sm ${
                category === cat.id 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white/5 border-white/10 text-text-secondary hover:border-primary/40'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass group rounded-[2.5rem] overflow-hidden border-white/10 hover:border-primary/40 transition-all flex flex-col h-full"
            >
              <Link to={`/ai-tools-news/${article.category}/${article.slug}`} className="relative aspect-video overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                    {article.category.replace('-', ' ')}
                  </span>
                </div>
              </Link>
              
              <div className="p-8 flex flex-col flex-1 space-y-4">
                <div className="flex items-center gap-4 text-xs text-text-secondary">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                </div>
                
                <h2 className="text-2xl font-bold font-display group-hover:text-primary transition-colors flex-1 leading-tight">
                  <Link to={`/ai-tools-news/${article.category}/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>
                
                <p className="text-text-secondary line-clamp-3 text-sm leading-relaxed">
                  {article.excerpt}
                </p>
                
                <Link 
                  to={`/ai-tools-news/${article.category}/${article.slug}`} 
                  className="pt-4 flex items-center gap-2 text-primary font-bold group/link"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <h3 className="text-2xl font-bold">More news coming soon!</h3>
            <p className="text-text-secondary">Our editorial team is busy testing the latest AI tools for you.</p>
            <Link to="/ai-tools-news" className="text-primary font-bold hover:underline">View All Articles</Link>
          </div>
        )}

        {/* Newsletter / CTA */}
        <div className="glass p-12 rounded-[3.5rem] border-primary/20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tighter italic">Never Miss an <span className="text-primary">AI Wave</span></h2>
            <p className="text-text-secondary text-lg">Subscribe to get the "AI Reality Check" - 3 tools that actually work, delivered every Sunday. No fluff, just value.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-primary outline-none text-white transition-all"
              />
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <span>Join Weekly</span>
                <Zap className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">12,450+ Creators Joined | Privacy Guaranteed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AINewsIndex;
