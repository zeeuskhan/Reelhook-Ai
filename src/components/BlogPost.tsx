import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { BLOG_POSTS } from '../data/blog';
import { Helmet } from 'react-helmet-async';

const BlogPost: React.FC = () => {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.slug === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div className="space-y-6">
          <h1 className="text-4xl font-black font-display uppercase italic">Post Not <span className="text-primary">Found</span></h1>
          <p className="text-text-secondary">The article you're looking for was moved or deleted.</p>
          <Link to="/blog" className="px-8 py-3 bg-primary text-white rounded-full font-bold inline-block">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary pt-32 pb-20">
      <Helmet>
        <title>{post.title} | ReelHooks Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4">
        <Link 
          to="/blog"
          className="inline-flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors mb-8 font-bold text-sm uppercase tracking-widest group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
          <span>Back to Feed</span>
        </Link>

        <div className="space-y-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest inline-block"
          >
            {post.category}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black font-display tracking-tight leading-tight uppercase italic"
          >
            {post.title}
          </motion.h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-[8px] uppercase">RH</div>
              <span>{post.author}</span>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative h-[300px] md:h-[500px] rounded-[3rem] overflow-hidden mb-16 border border-white/10"
        >
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-16">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="markdown-body prose prose-invert prose-primary max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:italic pr-4"
          >
            <ReactMarkdown>{post.content}</ReactMarkdown>

            {/* Post FAQs */}
            {post.faqs.length > 0 && (
              <div className="mt-20 pt-10 border-t border-white/5 space-y-8">
                <h2 className="text-3xl font-black font-display uppercase italic">Common <span className="text-primary">Questions</span></h2>
                <div className="space-y-4">
                  {post.faqs.map((faq, i) => (
                    <div key={i} className="glass p-6 rounded-3xl border-white/5 space-y-2">
                      <h4 className="font-bold text-lg">{faq.q}</h4>
                      <p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <aside className="space-y-12">
            <div className="glass p-8 rounded-[2rem] border-primary/20 bg-primary/5 sticky top-32 space-y-6">
              <h3 className="text-xl font-bold font-display uppercase italic">Grow <span className="text-primary">Faster</span></h3>
              <p className="text-sm text-text-secondary leading-relaxed">Use our free AI Hook Generator to create viral content in seconds.</p>
              <Link 
                to="/dashboard"
                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-2 hover:scale-[1.05] transition-all shadow-xl shadow-primary/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Try Generator</span>
              </Link>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Viral Metrics</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Engagement</span>
                    <span className="text-sm font-bold text-green-400">+12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Watch Time</span>
                    <span className="text-sm font-bold text-green-400">+18%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Shares</span>
                    <span className="text-sm font-bold text-primary">High</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <section className="mt-32 py-24 px-4 bg-white/[0.02] border-y border-white/5">
         <div className="max-w-7xl mx-auto space-y-12 text-center">
            <h2 className="text-4xl md:text-5xl font-black font-display uppercase italic italic tracking-tighter">Related <span className="text-primary">Articles</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {BLOG_POSTS.filter(p => p.id !== post.id).map(p => (
                <Link 
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="glass p-6 rounded-[2rem] border-white/5 hover:border-primary/40 transition-all text-left space-y-4 group"
                >
                  <div className="h-40 rounded-2xl overflow-hidden">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h4 className="font-bold font-display text-lg group-hover:text-primary transition-colors">{p.title}</h4>
                  <div className="flex items-center space-x-2 text-[10px] text-text-secondary font-black uppercase tracking-widest">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span>{p.date}</span>
                  </div>
                </Link>
              ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default BlogPost;
