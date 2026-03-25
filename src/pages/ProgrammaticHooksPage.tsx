import { useParams } from "react-router-dom";
import { NICHES } from "../data/niches";

export default function ProgrammaticHooksPage() {

  const { slug, subcategory } = useParams();

  const nicheData = NICHES.find(n => n.id === slug);

  if (!nicheData) {
    return <div style={{padding:"40px"}}>Page not found</div>;
  }

  // ✅ Dynamic FAQ (AUTO for ALL pages)
  const niche = (slug || "general").toLowerCase().replace(/-/g, " ");

  const currentFaq = [
    {
      question: `What are ${niche} reel hooks?`,
      answer: `${niche} reel hooks are short attention grabbing lines used in videos to stop scrolling and increase engagement.`
    },
    {
      question: `How to create viral ${niche} content?`,
      answer: `Focus on strong hooks, audience pain points and engaging storytelling in ${niche} content.`
    },
    {
      question: `What works best in ${niche} reels?`,
      answer: `Simple tips, relatable content and high value insights perform best in ${niche} reels.`
    },
    {
      question: `How to grow a ${niche} page on Instagram?`,
      answer: `Post consistently, use trending hooks and focus on high engagement content in the ${niche} niche.`
    }
  ];

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

      {/* ✅ SEO FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: currentFaq.map(faq => ({
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

      {/* ✅ Visible FAQ (important for SEO) */}
      <h2>Frequently Asked Questions</h2>

      {currentFaq.map((faq, i) => (
        <div key={i} style={{marginBottom:"15px"}}>
          <strong>{faq.question}</strong>
          <p>{faq.answer}</p>
        </div>
      ))}

    </div>
  );
}
