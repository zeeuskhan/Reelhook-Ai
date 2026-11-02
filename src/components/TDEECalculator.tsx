import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Activity, ArrowDown, ArrowUp, Minus, RotateCcw } from "lucide-react";

type Unit = "metric" | "imperial";
type Gender = "male" | "female";
type Goal = "lose" | "maintain" | "gain";

const activityOptions = [
  { value: 1.2, label: "Sedentary", detail: "Little or no exercise" },
  { value: 1.375, label: "Lightly active", detail: "Light exercise 1–3 days/week" },
  { value: 1.55, label: "Moderately active", detail: "Moderate exercise 3–5 days/week" },
  { value: 1.725, label: "Very active", detail: "Hard exercise 6–7 days/week" },
  { value: 1.9, label: "Extra active", detail: "Very hard exercise or physical job" }
];

const faqs = [
  { q: "What is a TDEE calculator?", a: "A TDEE calculator estimates your total daily energy expenditure: the calories your body uses in a typical day, including activity and exercise." },
  { q: "How is TDEE calculated?", a: "This calculator estimates basal metabolic rate with the Mifflin–St Jeor equation, then multiplies it by an activity factor to estimate daily calorie needs." },
  { q: "How many calories should I eat to lose weight?", a: "A modest calorie deficit is commonly used for gradual weight loss. This calculator shows an illustrative 500-calorie daily deficit; individual needs vary, and the result is only an estimate." },
  { q: "What is the difference between BMR and TDEE?", a: "BMR estimates the energy your body uses at rest. TDEE includes BMR plus the energy used for daily movement, exercise and digestion." },
  { q: "Are TDEE calculator results exact?", a: "No. Equations and activity multipliers provide estimates. Your actual energy needs can differ with body composition, health, sleep and daily movement." }
];

export default function TDEECalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("25");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("7");
  const [activity, setActivity] = useState("1.55");
  const [goal, setGoal] = useState<Goal>("maintain");

  const result = useMemo(() => {
    const a = Number(age);
    const rawWeight = Number(weight);
    const rawHeight = unit === "metric" ? Number(height) : (Number(feet) * 12 + Number(inches)) * 2.54;
    const kg = unit === "metric" ? rawWeight : rawWeight * 0.45359237;
    if (!Number.isFinite(a) || !Number.isFinite(kg) || !Number.isFinite(rawHeight) || a < 18 || a > 100 || kg < 25 || kg > 350 || rawHeight < 120 || rawHeight > 230) return null;
    const bmr = 10 * kg + 6.25 * rawHeight - 5 * a + (gender === "male" ? 5 : -161);
    const tdee = bmr * Number(activity);
    const calories = goal === "lose" ? tdee - 500 : goal === "gain" ? tdee + 300 : tdee;
    const protein = Math.round(kg * (goal === "lose" ? 1.8 : 1.6));
    const fat = Math.round((calories * 0.27) / 9);
    const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
    return { bmr: Math.round(bmr), tdee: Math.round(tdee), calories: Math.round(calories), protein, fat, carbs, bmi: kg / ((rawHeight / 100) ** 2) };
  }, [age, weight, height, feet, inches, unit, gender, activity, goal]);

  const reset = () => { setUnit("metric"); setGender("male"); setAge("25"); setWeight("70"); setHeight("170"); setFeet("5"); setInches("7"); setActivity("1.55"); setGoal("maintain"); };
  const field = "w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
  const label = "mb-2 block text-sm font-semibold text-slate-300";

  return (
    <div className="min-h-screen bg-bg pb-20 pt-28 text-white">
      <Helmet>
        <title>Free TDEE Calculator: Daily Calorie Needs & BMR | ReelHooks</title>
        <meta name="description" content="Use our free TDEE calculator to estimate daily calorie needs, BMR and calories for weight loss, maintenance or weight gain. Includes activity levels and macro estimates." />
        <meta name="keywords" content="tdee calculator, free tdee calculator, daily calorie calculator, calorie maintenance calculator, bmr calculator, tdee calculator for weight loss, calories to maintain weight" />
        <link rel="canonical" href="https://www.reelhooks.site/tdee-calculator" />
        <meta property="og:title" content="Free TDEE Calculator: Daily Calorie Needs & BMR" />
        <meta property="og:description" content="Estimate your daily calorie needs with a free TDEE and BMR calculator." />
        <meta property="og:url" content="https://www.reelhooks.site/tdee-calculator" />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "WebApplication", name: "Free TDEE Calculator",
          url: "https://www.reelhooks.site/tdee-calculator", applicationCategory: "HealthApplication",
          operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description: "Estimate basal metabolic rate, total daily energy expenditure and daily calorie targets."
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          mainEntity: faqs.map(({q,a}) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.reelhooks.site/" },
            { "@type": "ListItem", position: 2, name: "TDEE Calculator", item: "https://www.reelhooks.site/tdee-calculator" }
          ]
        })}</script>
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-400"><a href="/" className="hover:text-primary">Home</a><span className="mx-2">/</span><span className="text-slate-200">TDEE Calculator</span></nav>
        <header className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"><Activity size={16}/> Free health & fitness calculator</div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">TDEE Calculator</h1>
          <p className="text-lg leading-relaxed text-slate-300">Estimate how many calories you burn each day. Calculate your BMR, daily maintenance calories and a starting calorie target for weight loss or weight gain.</p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl sm:p-8" aria-labelledby="calculator-heading">
            <div className="mb-6 flex items-center justify-between gap-3"><h2 id="calculator-heading" className="text-2xl font-bold">Your details</h2><button onClick={reset} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white"><RotateCcw size={15}/> Reset</button></div>
            <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-900 p-1" role="group" aria-label="Measurement units">
              <button onClick={() => setUnit("metric")} className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${unit === "metric" ? "bg-primary text-white" : "text-slate-400 hover:text-white"}`}>Metric (kg, cm)</button>
              <button onClick={() => setUnit("imperial")} className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${unit === "imperial" ? "bg-primary text-white" : "text-slate-400 hover:text-white"}`}>Imperial (lb, ft)</button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label className={label} htmlFor="tdee-gender">Sex used for equation</label><select id="tdee-gender" className={field} value={gender} onChange={e=>setGender(e.target.value as Gender)}><option value="male">Male</option><option value="female">Female</option></select></div>
              <div><label className={label} htmlFor="tdee-age">Age (18–100)</label><input id="tdee-age" className={field} type="number" min="18" max="100" value={age} onChange={e=>setAge(e.target.value)} /></div>
              <div><label className={label} htmlFor="tdee-weight">Weight ({unit === "metric" ? "kg" : "lb"})</label><input id="tdee-weight" className={field} type="number" min="25" max={unit === "metric" ? "350" : "770"} step="0.1" value={weight} onChange={e=>setWeight(e.target.value)} /></div>
              {unit === "metric" ? <div><label className={label} htmlFor="tdee-height">Height (cm)</label><input id="tdee-height" className={field} type="number" min="120" max="230" value={height} onChange={e=>setHeight(e.target.value)} /></div> : <div><label className={label}>Height (ft / in)</label><div className="grid grid-cols-2 gap-2"><input aria-label="Height feet" className={field} type="number" min="4" max="7" value={feet} onChange={e=>setFeet(e.target.value)} placeholder="Feet"/><input aria-label="Height inches" className={field} type="number" min="0" max="11" value={inches} onChange={e=>setInches(e.target.value)} placeholder="Inches"/></div></div>}
              <div className="sm:col-span-2"><label className={label} htmlFor="tdee-activity">Activity level</label><select id="tdee-activity" className={field} value={activity} onChange={e=>setActivity(e.target.value)}>{activityOptions.map(o=><option key={o.value} value={o.value}>{o.label} · {o.detail}</option>)}</select></div>
              <div className="sm:col-span-2"><span className={label}>Your goal</span><div className="grid grid-cols-3 gap-2">
                {([{value:"lose",name:"Lose weight",icon:<ArrowDown size={16}/>},{value:"maintain",name:"Maintain",icon:<Minus size={16}/>},{value:"gain",name:"Gain weight",icon:<ArrowUp size={16}/>}] as const).map(g=><button key={g.value} type="button" onClick={()=>setGoal(g.value)} className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-xs font-bold transition sm:flex-row sm:justify-center sm:text-sm ${goal===g.value ? "border-primary bg-primary/15 text-white" : "border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/30"}`}>{g.icon}{g.name}</button>)}
              </div></div>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-slate-500">Estimates are for adults and are not medical advice. This calculator uses the Mifflin–St Jeor equation.</p>
          </section>

          <section className="space-y-5" aria-live="polite">
            {result ? <>
              <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 to-slate-900 p-6 sm:p-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">{goal === "lose" ? "Suggested weight-loss target" : goal === "gain" ? "Suggested weight-gain target" : "Daily maintenance calories"}</p>
                <div className="flex flex-wrap items-end gap-2"><strong className="text-5xl font-black tracking-tight sm:text-6xl">{result.calories.toLocaleString()}</strong><span className="pb-2 text-slate-300">kcal / day</span></div>
                <p className="mt-3 text-sm text-slate-300">Estimated TDEE: {result.tdee.toLocaleString()} kcal/day</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><p className="text-sm text-slate-400">BMR</p><p className="mt-1 text-2xl font-extrabold">{result.bmr.toLocaleString()}</p><p className="text-xs text-slate-500">Calories at rest / day</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><p className="text-sm text-slate-400">BMI (estimate)</p><p className="mt-1 text-2xl font-extrabold">{result.bmi.toFixed(1)}</p><p className="text-xs text-slate-500">Screening measure only</p></div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6"><h3 className="mb-4 text-lg font-bold">Estimated daily macros</h3><div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-2xl font-extrabold text-primary">{result.protein}g</p><p className="text-xs text-slate-400">Protein</p></div>
                <div><p className="text-2xl font-extrabold text-primary">{result.carbs}g</p><p className="text-xs text-slate-400">Carbs</p></div>
                <div><p className="text-2xl font-extrabold text-primary">{result.fat}g</p><p className="text-xs text-slate-400">Fat</p></div>
              </div><p className="mt-4 text-xs leading-relaxed text-slate-500">Macro amounts are illustrative starting estimates, not individualized nutrition prescriptions.</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><h3 className="mb-2 font-bold">How to use your estimate</h3><p className="text-sm leading-relaxed text-slate-400">Track your average intake and body-weight trend over several weeks. Adjust gradually if needed. Daily energy needs vary, so treat this result as a starting estimate rather than an exact target.</p></div>
            </> : <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm text-amber-200">Please enter valid details: age 18–100, weight 25–350 kg (or equivalent), and height 120–230 cm.</div>}
          </section>
        </div>

        <article className="mx-auto mt-16 max-w-4xl space-y-10 text-slate-300">
          <section className="space-y-3"><h2 className="text-2xl font-bold text-white">What is TDEE?</h2><p className="leading-8">Total Daily Energy Expenditure (TDEE) is an estimate of the calories your body uses over a full day. It includes your basal metabolic rate, everyday movement, planned exercise and the energy used to digest food. Knowing your estimated TDEE can help you understand a starting point for calorie planning.</p></section>
          <section className="space-y-3"><h2 className="text-2xl font-bold text-white">How this TDEE calculator works</h2><p className="leading-8">First, the calculator estimates your Basal Metabolic Rate (BMR) using the Mifflin–St Jeor equation. It then multiplies BMR by an activity factor to estimate TDEE. The goal selector displays maintenance calories, an illustrative 500-calorie deficit for weight loss, or a 300-calorie surplus for weight gain.</p><div className="overflow-x-auto rounded-xl border border-white/10"><table className="w-full text-left text-sm"><thead className="bg-white/5 text-white"><tr><th className="p-3">Activity level</th><th className="p-3">Multiplier</th><th className="p-3">Description</th></tr></thead><tbody>{activityOptions.map(o=><tr key={o.value} className="border-t border-white/10"><td className="p-3">{o.label}</td><td className="p-3">{o.value.toFixed(3)}</td><td className="p-3">{o.detail}</td></tr>)}</tbody></table></div></section>
          <section className="space-y-3"><h2 className="text-2xl font-bold text-white">BMR vs TDEE: what is the difference?</h2><p className="leading-8">BMR is the estimated energy your body needs at rest to support essential functions. TDEE is higher because it also accounts for activity and digestion. For daily calorie planning, TDEE is generally the more useful estimate.</p></section>
          <section className="space-y-5"><h2 className="text-2xl font-bold text-white">TDEE calculator FAQs</h2>{faqs.map(f=><details key={f.q} className="rounded-xl border border-white/10 bg-white/[0.025] p-5"><summary className="cursor-pointer font-bold text-white">{f.q}</summary><p className="mt-3 leading-7 text-slate-400">{f.a}</p></details>)}</section>
          <p className="border-t border-white/10 pt-6 text-sm leading-7 text-slate-500">Health note: This tool provides general educational estimates only. It is not designed for children, pregnancy, eating-disorder recovery or medical nutrition therapy. Speak with a qualified healthcare professional or registered dietitian for personal guidance.</p>
        </article>
      </div>
    </div>
  );
}
