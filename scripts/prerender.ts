import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderSeoHtml, isTier1Url } from "../server.ts";
import { NICHES } from "../src/data/niches.ts";
import { SEO_ARTICLES } from "../src/data/seoArticles.ts";
import { TOOL_SEO_CONTENT } from "../src/data/toolSEOContent.ts";
import { BLOG_POSTS } from "../src/data/blog.ts";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(projectRoot, "dist");
const template = await fs.readFile(path.join(distDir, "index.html"), "utf8");

const publicRoutes = new Set<string>(["/", "/sitemap"]);

for (const slug of Object.keys(SEO_ARTICLES)) {
  const route = \`/\${slug}\`;
  if (isTier1Url(route)) publicRoutes.add(route);
}
for (const slug of Object.keys(TOOL_SEO_CONTENT)) {
  const route = \`/tools/\${slug}\`;
  if (isTier1Url(route)) publicRoutes.add(route);
}
for (const post of BLOG_POSTS) {
  const route = \`/blog/\${post.slug}\`;
  if (isTier1Url(route)) publicRoutes.add(route);
}
for (const niche of NICHES) {
  const route = \`/hooks/\${niche.id}-english\`;
  if (isTier1Url(route)) publicRoutes.add(route);
}

const privateRoutes = ["/dashboard", "/profile"];

async function writeRoute(route: string) {
  const html = renderSeoHtml(route, template);
  const outputDir = route === "/" ? distDir : path.join(distDir, route.replace(/^\\//, ""));
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, "index.html"), html, "utf8");
}

for (const route of publicRoutes) await writeRoute(route);
for (const route of privateRoutes) await writeRoute(route);

const today = new Date().toISOString().slice(0, 10);
const urls = [...publicRoutes].map((route) => {
  const priority = route === "/" ? "1.0"
    : route.startsWith("/tools/") ? "0.9"
    : route.startsWith("/hooks/") ? "0.8"
    : "0.7";
  const loc = \`https://www.reelhooks.site\${route === "/" ? "/" : route}\`;
  return \`  <url>\\n    <loc>\${loc}</loc>\\n    <lastmod>\${today}</lastmod>\\n    <priority>\${priority}</priority>\\n  </url>\`;
}).join("\\n");

const sitemap = \`<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n\${urls}\\n</urlset>\\n\`;
await fs.writeFile(path.join(distDir, "sitemap.xml"), sitemap, "utf8");

const robots = "User-agent: *\\nAllow: /\\n\\nSitemap: https://www.reelhooks.site/sitemap.xml\\n";
await fs.writeFile(path.join(distDir, "robots.txt"), robots, "utf8");

console.log(\`SEO prerender complete: \${publicRoutes.size} public URLs and \${privateRoutes.length} noindex routes.\`);
