import { Component, StrictMode, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ReelHooks application render failed:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
          <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F172A]/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
              <a href="/" className="text-2xl font-black tracking-tight text-[#8B7CFF]">ReelHooks<span className="text-white">.site</span></a>
              <nav className="flex items-center gap-5 text-sm font-semibold text-slate-300">
                <a href="/" className="hover:text-white">Home</a>
                <a href="/explore" className="hover:text-white">Explore</a>
                <a href="/blog" className="hover:text-white">Blog</a>
                <a href="/about" className="hover:text-white">About</a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-3xl px-5 py-20 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#8B7CFF]">ReelHooks AI</p>
            <h1 className="mb-5 text-4xl font-black leading-tight md:text-5xl">Free AI Reel Hook Generator</h1>
            <p className="mb-8 text-lg leading-relaxed text-slate-300">Create engaging opening ideas for Instagram Reels, TikTok and YouTube Shorts. The app is recovering from a temporary loading problem.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => window.location.reload()} className="rounded-xl bg-[#6C5CE7] px-6 py-3 font-bold text-white hover:bg-[#5A4BD1]">Reload ReelHooks</button>
              <a href="/explore" className="rounded-xl border border-white/20 px-6 py-3 font-bold text-white hover:bg-white/10">Browse hook ideas</a>
            </div>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('ReelHooks root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);
