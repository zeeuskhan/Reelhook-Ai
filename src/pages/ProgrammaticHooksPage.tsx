import { useParams } from "react-router-dom";
import { NICHES } from "../data/niches";

export default function ProgrammaticHooksPage() {

  const { slug, subcategory } = useParams();

  const nicheData = NICHES.find(n => n.id === slug);

  if (!nicheData) {
    return <div style={{padding:"40px"}}>Page not found</div>;
  }

  // ✅ Dynamic FAQ System
  const niche = slug || "general";

  const faqData: any = {
    fitness: [
      {
        question: "What are fitness reel hooks?",
        answer: "Fitness reel hooks are short lines used in workout videos to grab attention instantly."
      },
      {
        question: "How to create viral fitness content?",
        answer: "Use transformation, results and strong attention grabbing hooks."
      }
    ],
    beauty: [
      {
        question: "What are beauty reel hooks?",
        answer: "Beauty reel hooks are used in skincare and makeup videos to attract viewers."
      },
      {
        question: "How to grow a beauty page on Instagram?",
        answer: "Use trending hooks, before-after results and engaging captions."
      }
    ],
    tech: [
      {
        question: "What are tech reel hooks?",
        answer: "Tech hooks are short lines used in gadget and review videos to capture attention."
      },
      {
        question: "How to make viral tech reels?",
        answer: "Focus on unique features, comparisons and surprising facts."
      }
    ]
  };

  const currentFaq = faqData[niche] || faqData["fitness"];

  const hooks = [
    "Stop scrolling if you care about this",
    "Nobody talks about this trick",
    "This simple change gets more views",
    "Most people are doing this wrong",
    "This strategy works every time",
    "If you want more engagement watch this",
    "The secret behind viral reels",
    "3 mistakes ruining your reach",
    "This hack works for every creator",
    "Try this before posting your next reel"
  ];

  return (
    <div style={{padding:"40px", maxWidth:"900px", margin:"auto"}}>

      {/* ✅ FAQ Schema Inject */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: currentFaq.map((faq: any) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer
              }
            }))
          })
        }}
      />

      <h1>
        {subcategory
          ? `${subcategory} ${nicheData.name} Reel Hooks`
          : `${nicheData.name} Reel Hooks Generator`}
      </h1>

      <p>
        Discover viral Instagram reel hooks for the {nicheData.name} niche.
        Hooks are the first few seconds of your reel that grab attention
        and stop users from scrolling.
      </p>

      <h2>Viral Hook Examples</h2>

      <ul>
        {hooks.map((hook, i) => (
          <li key={i}>{hook}</li>
        ))}
      </ul>

      <h2>Popular {nicheData.name} Hook Topics</h2>

      <ul>
        {nicheData.subcategories.map((sub) => (
          <li key={sub}>
            <a href={`/hooks/${slug}/${sub.toLowerCase().replace(/\s+/g,"-")}`}>
              {sub} Hooks
            </a>
          </li>
        ))}
      </ul>

      <h2>Generate Your Own Hooks</h2>

      <p>
        Want unlimited viral hooks? Use our AI powered Reel Hook Generator.
      </p>

      <a href="/" style={{color:"#38bdf8",fontWeight:"bold"}}>
        Open ReelHook AI Tool
      </a>

      {/* ✅ Optional: Show FAQ on page (SEO boost) */}
      <h2>Frequently Asked Questions</h2>
      {currentFaq.map((faq: any, i: number) => (
        <div key={i} style={{marginBottom:"15px"}}>
          <strong>{faq.question}</strong>
          <p>{faq.answer}</p>
        </div>
      ))}

    </div>
  );
}
