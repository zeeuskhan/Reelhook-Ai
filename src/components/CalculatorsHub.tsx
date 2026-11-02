import React from "react";
import { Helmet } from "react-helmet-async";
import { Activity, ArrowUpRight, BookOpen } from "lucide-react";
const base="https://www.reelhooks.site";
export default function CalculatorsHub(){
 return <main className="min-h-screen bg-bg px-4 pb-20 pt-28 text-white"><div className="mx-auto max-w-5xl">
  <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-400"><a href="/">Home</a> / <span className="text-slate-200">Calculators</span></nav>
  <Helmet><title>Free Online Calculators | ReelHooks</title><meta name="description" content="Explore free online health and fitness calculators from ReelHooks. Start with the TDEE calculator for daily calorie and energy estimates."/><link rel="canonical" href={base+"/calculators"}/><meta name="robots" content="index,follow"/></Helmet>
  <header className="mb-10 max-w-3xl"><h1 className="mb-4 text-4xl font-black sm:text-5xl">Free Online Calculators</h1><p className="text-lg leading-8 text-slate-300">Browse practical calculators and guides. Each result is an estimate based on the assumptions described on its page. Health-related tools are educational and do not replace advice from a qualified professional.</p></header>
  <section className="grid gap-4 md:grid-cols-2"><a href="/tdee-calculator" className="rounded-2xl border border-violet-400/30 bg-violet-500/10 p-6 hover:border-violet-300"><div className="mb-4 flex items-center justify-between"><Activity className="h-7 w-7 text-violet-300"/><ArrowUpRight/></div><h2 className="text-2xl font-bold">TDEE Calculator</h2><p className="mt-2 text-slate-300">Estimate BMR, total daily energy expenditure and illustrative calorie targets with three equations.</p><span className="mt-5 inline-block font-semibold text-violet-200">Open calculator →</span></a>
  <a href="/blog/tdee-calculator-formula-mifflin-st-jeor-explained" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/30"><div className="mb-4 flex items-center justify-between"><BookOpen className="h-7 w-7 text-slate-300"/><ArrowUpRight/></div><h2 className="text-2xl font-bold">TDEE formula guide</h2><p className="mt-2 text-slate-300">Understand how resting energy estimates and activity multipliers are combined.</p><span className="mt-5 inline-block font-semibold">Read the guide →</span></a></section>
  <p className="mt-10 text-sm text-slate-400">More standalone calculators will be listed here when they are available and tested. We do not link to unfinished tools.</p>
 </div></main>
}
