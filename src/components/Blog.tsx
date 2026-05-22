import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Clock, 
  Calendar, 
  User,
  ChevronRight,
  Search,
  BookOpen
} from 'lucide-react';
import { BLOG_POSTS } from '../data/blog';

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-wider"
          >
            <BookOpen className="w-4 h-4" />
            <span>Content Lab & Blog</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black font-display tracking-tight uppercase italic"
          >
            Viral <span className="text-primary">Content</span> Insights
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto"
          >
            Master the algorithm with our deep-dives into viral hooks, AI tools, and creator growth strategies.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, i) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group glass rounded-[2.5rem] overflow-hidden border-white/5 hover:border-primary/40 transition-all flex flex-col"
            >
              <Link to={`/blog/${post.slug}`} className="relative h-64 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest leading-none">
                    {post.category}
                  </span>
                </div>
              </Link>
              <div className="p-8 flex-1 flex flex-col space-y-4">
                <div className="flex items-center space-x-4 text-xs text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <Link to={`/blog/${post.slug}`}>
                  <h3 className="text-2xl font-bold font-display leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-text-secondary text-sm line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <Link 
                  to={`/blog/${post.slug}`}
                  className="pt-4 flex items-center space-x-2 text-primary font-bold text-sm uppercase tracking-widest group"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="py-20 border-t border-white/5 text-center space-y-8">
          <h2 className="text-3xl font-bold font-display">Never Miss a Strategy Update</h2>
          <div className="max-w-xl mx-auto glass p-2 rounded-full border-white/10 flex items-center pr-2">
            <input 
              type="email" 
              placeholder="Enter your email to join 50k+ creators..."
              className="flex-1 bg-transparent border-none outline-none px-6 text-sm"
            />
            <button className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-all text-sm shrink-0">Join Creator Lab</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog;
