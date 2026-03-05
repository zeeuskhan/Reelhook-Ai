import { useParams } from "react-router-dom";
import { NICHES } from "../data/niches";

export default function ProgrammaticHooksPage() {

  const { slug } = useParams();

  const nicheData = NICHES.find(n => n.id === slug);

  if (!nicheData) {
    return <div>Page not found</div>;
  }

  return (
    <div style={{padding:"40px"}}>
      <h1>{nicheData.name} Reel Hooks Generator</h1>

      <p>
        Generate viral reel hooks for {nicheData.name}. These hooks are designed
        to stop scrolling and increase engagement on Instagram reels.
      </p>

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

    </div>
  );
}
