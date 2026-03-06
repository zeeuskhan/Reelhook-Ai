import { useParams } from "react-router-dom";
import { NICHES } from "../data/niches";

export default function ProgrammaticHooksPage() {

  const { slug, subcategory } = useParams();

  const nicheData = NICHES.find(n => n.id === slug);

  if (!nicheData) {
    return <div style={{padding:"40px"}}>Page not found</div>;
  }

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

    </div>
  );
}
