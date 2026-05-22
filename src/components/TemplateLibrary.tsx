import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Copy, 
  CheckCircle2, 
  Zap, 
  ChevronRight,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { TEMPLATE_CATEGORIES } from '../data/templates';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TemplateLibraryProps {
  onUse: (hook: string) => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onUse }) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const s = search.toLowerCase();
    if (!s) return TEMPLATE_CATEGORIES;
    
    return TEMPLATE_CATEGORIES.map(cat => ({
      ...cat,
      templates: cat.templates.filter(t => t.toLowerCase().includes(s))
    })).filter(cat => cat.templates.length > 0 || cat.name.toLowerCase().includes(s));
  }, [search]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedTemplate(text);
    setTimeout(() => setCopiedTemplate(null), 2000);
    onUse(text);
  };

  return (
    <div className="space-y-8">
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
          <Search className="w-5 h-5 text-primary group-focus-within:text-primary transition-colors" />
        </div>
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates (e.g. Fitness, Business)..."
          className="w-full bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-text-secondary/40 group-hover:bg-white/[0.08] shadow-lg"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-bold transition-all border",
            selectedCategory === null ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-text-secondary hover:text-white"
          )}
        >
          All Categories
        </button>
        {TEMPLATE_CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-all border flex items-center space-x-2",
              selectedCategory === cat.id ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-text-secondary hover:text-white"
            )}
          >
            {cat.icon}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCategories
          .filter(cat => !selectedCategory || cat.id === selectedCategory)
          .map((cat, idx) => (
          <motion.div 
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 px-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold font-display">{cat.name} Hooks</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {cat.templates.map((template, tidx) => (
                <div 
                  key={tidx}
                  className="glass p-4 rounded-xl border-white/5 hover:border-primary/30 transition-all group relative"
                >
                  <p className="text-sm font-medium leading-relaxed pr-10">{template}</p>
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <button 
                      onClick={() => handleCopy(template)}
                      className="p-1.5 rounded-lg bg-white/5 text-text-secondary hover:text-primary transition-all cursor-pointer"
                    >
                      {copiedTemplate === template ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-20 glass rounded-3xl border-white/10 space-y-4">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-10 h-10 text-text-secondary" />
          </div>
          <p className="text-text-secondary">No templates found for "{search}". Try another keyword!</p>
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;
