import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { NICHES } from "./src/data/niches"; // Note: removed .js extension

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // robots.txt
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nAllow: /\nSitemap: https://reelhook.ai/sitemap.xml");
  });

  // sitemap.xml
  app.get("/sitemap.xml", (req, res) => {
    res.type("application/xml");
    
    const variations = ["english", "hindi", "hinglish", "instagram", "reels"];
    
    // Generate URLs for main niches
    const mainNicheUrls = NICHES.flatMap(n => 
      variations.map(v => `<url><loc>https://reelhook.ai/hooks/${n.id}-${v}</loc><priority>0.7</priority></url>`)
    );

    // Generate URLs for subcategories
    const subcategoryUrls = NICHES.flatMap(n => 
      n.subcategories.flatMap(s => {
        const subSlug = s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return variations.map(v => `<url><loc>https://reelhook.ai/hooks/${subSlug}-${v}</loc><priority>0.6</priority></url>`);
      })
    );

    const allUrls = [...mainNicheUrls, ...subcategoryUrls].join("\n  ");

    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://reelhook.ai/</loc><priority>1.0</priority></url>
  <url><loc>https://reelhook.ai/dashboard</loc><priority>0.8</priority></url>
  <url><loc>https://reelhook.ai/pricing</loc><priority>0.8</priority></url>
  <url><loc>https://reelhook.ai/about</loc><priority>0.5</priority></url>
  <url><loc>https://reelhook.ai/blog</loc><priority>0.7</priority></url>
  ${allUrls}
</urlset>`);
  });

  // Programmatic SEO Routes (Example)
  app.get("/api/seo/niche/:niche", (req, res) => {
    const { niche } = req.params;
    res.json({
      title: `${niche.charAt(0).toUpperCase() + niche.slice(1)} Reel Hooks - Viral Instagram Ideas`,
      description: `Get the best ${niche} reel hooks to stop scrolling and boost engagement. Free AI-powered hook generator.`,
      content: `This is SEO optimized content for ${niche} hooks...`
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
