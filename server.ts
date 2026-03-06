import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { NICHES } from "./src/data/niches";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health Check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // ROBOTS.TXT
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(
`User-agent: *
Allow: /

Sitemap: https://reelhooks.site/sitemap.xml`
    );
  });

  // SITEMAP.XML
  app.get("/sitemap.xml", (req, res) => {

    res.type("application/xml");

    const variations = ["english","hindi","hinglish","instagram","reels"];

    // MAIN NICHES
    const mainNicheUrls = NICHES.flatMap(n =>
      variations.map(v =>
        `<url>
          <loc>https://reelhooks.site/hooks/${n.id}-${v}</loc>
          <priority>0.7</priority>
        </url>`
      )
    );

    // SUB CATEGORIES
    const subcategoryUrls = NICHES.flatMap(n =>
      n.subcategories.flatMap(s => {

        const subSlug = s
          .toLowerCase()
          .replace(/\s+/g,"-")
          .replace(/[^a-z0-9-]/g,"");

        return variations.map(v =>
          `<url>
            <loc>https://reelhooks.site/hooks/${subSlug}-${v}</loc>
            <priority>0.6</priority>
          </url>`
        );

      })
    );

    const allUrls = [...mainNicheUrls, ...subcategoryUrls].join("\n");

    res.send(`<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>
<loc>https://reelhooks.site/</loc>
<priority>1.0</priority>
</url>

<url>
<loc>https://reelhooks.site/dashboard</loc>
<priority>0.8</priority>
</url>

<url>
<loc>https://reelhooks.site/pricing</loc>
<priority>0.8</priority>
</url>

<url>
<loc>https://reelhooks.site/about</loc>
<priority>0.5</priority>
</url>

<url>
<loc>https://reelhooks.site/blog</loc>
<priority>0.7</priority>
</url>

${allUrls}

</urlset>`);
  });

  // PROGRAMMATIC SEO API
  app.get("/api/seo/niche/:niche", (req,res)=>{

    const { niche } = req.params;

    res.json({
      title: `${niche.charAt(0).toUpperCase() + niche.slice(1)} Reel Hooks - Viral Instagram Ideas`,
      description: `Get the best ${niche} reel hooks to stop scrolling and boost engagement. Free AI powered hook generator.`,
      content: `SEO optimized content for ${niche} reel hooks niche.`
    });

  });


  // VITE DEV SERVER
  if(process.env.NODE_ENV !== "production"){

    const vite = await createViteServer({
      server:{ middlewareMode:true },
      appType:"spa"
    });

    app.use(vite.middlewares);

  } else {

    // PRODUCTION STATIC BUILD
    app.use(express.static(path.join(__dirname,"dist")));

    app.get("*",(req,res)=>{
      res.sendFile(path.join(__dirname,"dist","index.html"));
    });

  }

  app.listen(PORT,"0.0.0.0",()=>{
    console.log(`Server running on http://localhost:${PORT}`);
  });

}

startServer();
