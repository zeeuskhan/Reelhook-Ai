import React, { useState } from "react";
import { SEO } from "../App";
import { CheckCircle2, Mail, Globe, Sparkles, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setSubmitted(true);
    // Celebrate contact submission with confetti
    try {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-12">
      <SEO 
        title="Contact ReelHooks | Support & Collaboration for Creators"
        description="Need help with your viral hooks? Contact the ReelHooks support team for expert advice, collaborations, or feature requests. We respond within 24 hours—get in touch!"
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.reelhooks.site/" },
            { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://www.reelhooks.site/contact" }
          ]
        }}
      />
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold font-display">Get in Touch</h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Have questions about our viral reel hook generator? Or want to discuss organic search strategies? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
            <h3 className="text-2xl font-bold font-display">Why reach out?</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span className="text-text-secondary"><strong>Technical Support:</strong> Need help with the dashboard, script analyzer, or custom tools?</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span className="text-text-secondary"><strong>Partnerships:</strong> Interested in integrating ReelHooks with your platform or agency?</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span className="text-text-secondary"><strong>Feedback:</strong> Have ideas on how Murtaza and the team can improve our hook models?</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-4 px-4">
            <div className="flex items-center space-x-4 text-text-secondary">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-primary">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">Email Us</p>
                <p className="text-white text-base font-semibold">MURTAZADARVESH@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-text-secondary">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-primary">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">Founder's Base</p>
                <p className="text-white text-base">San Francisco, CA / Mumbai, India</p>
              </div>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="glass p-8 rounded-3xl border-primary/20 bg-primary/5 flex flex-col justify-center items-center text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-primary" />
            <h3 className="text-2xl font-bold font-display">Message Received!</h3>
            <p className="text-text-secondary">Thank you for contacting ReelHooks. Murtaza or a member of our creator strategy team will reply directly to your inbox within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-6 border-white/5">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-bg border border-white/10 rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white" 
                placeholder="John Doe" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-bg border border-white/10 rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white" 
                placeholder="john@example.com" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Subject</label>
              <select 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-bg border border-white/10 rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
              >
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Partnership</option>
                <option>Feedback</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Message</label>
              <textarea 
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-bg border border-white/10 rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[150px] text-white" 
                placeholder="How can we help you today?"
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 cursor-pointer"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
