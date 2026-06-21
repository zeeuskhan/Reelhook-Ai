import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { NICHES } from "./src/data/niches.ts";
import { SEO_CATEGORY_CONTENT } from "./src/data/seoContent.ts";
import { SEO_ARTICLES } from "./src/data/seoArticles.ts";
import { TOOL_SEO_CONTENT } from "./src/data/toolSEOContent.ts";
import { BLOG_POSTS } from "./src/data/blog.ts";
import { enhanceArticleContentAndInterlink } from "./src/utils/seoHelper.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pre-rendering wrapper function for SEO
function renderSeoHtml(urlPath: string, html: string): string {
  const cleanPath = urlPath.split("?")[0].split("#")[0];

  let title = "Reel Hook Generator: Get Free Scroll-Stopping Reel Hooks (2026)";
  let description = "The #1 free AI reel hook generator online. Instantly create high-retention reel hook ideas for Instagram, TikTok & YouTube. Grow 10x faster with no signup required!";
  let canonicalUrl = `https://www.reelhooks.site${cleanPath === "/" ? "/" : cleanPath}`;
  let bodyContent = "";
  let schemasArray: any[] = [];

  // 1. Programmatic Niche pages: /hooks/:slug
  const hooksMatch = cleanPath.match(/^\/hooks\/([a-zA-Z0-9-]+)$/);
  if (hooksMatch) {
    const slug = hooksMatch[1];
    const parts = slug.split("-");
    const lang = parts.pop() || "english";
    const slugId = parts.join("-");

    const main = NICHES.find(n => n.id === slugId);
    let name = slugId.charAt(0).toUpperCase() + slugId.slice(1);
    let categoryId = slugId;
    
    if (main) {
      name = main.name;
      categoryId = main.id;
    } else {
      for (const n of NICHES) {
        const sub = n.subcategories.find(s => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slugId);
        if (sub) {
          name = sub;
          categoryId = n.id;
          break;
        }
      }
    }

    const displayLang = lang.charAt(0).toUpperCase() + lang.slice(1);
    title = `${name} Reel Hook Generator – Free Viral Hooks for Instagram, TikTok & Shorts (2026)`;
    description = `Generate viral ${name} reel hooks in ${displayLang} for Instagram, TikTok & YouTube Shorts. Get free scroll-stopping dynamic AI hook templates now!`;

    const richContentSource = SEO_CATEGORY_CONTENT[categoryId] || SEO_CATEGORY_CONTENT["fitness"] || {
      introduction: `Struggling to get views on your ${name} reels? The first 3 seconds are everything. Our instagram hook generator has analyzed thousands of viral videos to bring you these high-performing viral reel hooks specifically optimized for the ${name} niche.`,
      section1: "", section2: "", section3: "", conclusion: ""
    };

    const replaceKeywords = (txt: string) => {
      if (!txt) return "";
      return txt
        .replace(/fitness/gi, name)
        .replace(/business/gi, name)
        .replace(/motivation/gi, name)
        .replace(/storytelling/gi, name)
        .replace(/education/gi, name)
        .replace(/marketing/gi, name)
        .replace(/finance/gi, name)
        .replace(/travel/gi, name)
        .replace(/tech/gi, name)
        .replace(/lifestyle/gi, name);
    };

    const finalIntro = replaceKeywords(richContentSource.introduction);
    const s1 = replaceKeywords(richContentSource.section1);
    const s2 = replaceKeywords(richContentSource.section2);
    const s3 = replaceKeywords(richContentSource.section3);
    const sConc = replaceKeywords(richContentSource.conclusion);

    // List of 10-15 example hooks (Issue 3 Requirement)
    const exampleHooks = [
      `POV: You finally learned the secret to ${name} in 2026...`,
      `Stop doing ${name} like this if you want to grow fast!`,
      `This is exactly why your ${name} videos are getting 200 views.`,
      `I wish I knew this ${name} secret before starting my creator journey.`,
      `The illegal feeling hack for ${name} that nobody is talking about.`,
      `Here is how to master ${name} in only 3 simple steps.`,
      `3 major mistakes you make daily in your ${name} reels.`,
      `Don't scroll if you are trying to improve your ${name}!`,
      `This single change doubled my ${name} results in just 7 days.`,
      `Is ${name} actually worth it? Here is the absolute truth.`,
      `The ultimate ${name} cheat sheet you need to steal today.`,
      `My simple secret for 10x visual engagement in ${name}.`,
      `Stop scrolling if you want to grow your ${name} account.`
    ];

    const exampleHooksHtml = exampleHooks
      .map(h => `<div style="background:#1E293B;border:1px solid rgba(255,255,255,0.1);padding:24px;border-radius:16px;margin-bottom:16px;"><p style="font-style:italic;color:#F8FAFC;font-size:16px;margin:0;">"${h}"</p></div>`)
      .join("\n");

    const faqs = [
      {
        q: `What is the best hook for ${name} reels?`,
        a: `The absolute best hook is one that triggers high retention or a curiosity gap. Using negative constraints like 'Stop doing ${name} like this' or authority building like 'The real secret to ${name}' works amazingly well.`
      },
      {
        q: `Can I generate hooks in other languages?`,
        a: `Yes, our free tool supports multiple variations including English, Hindi, and Hinglish so you can connect with your core audience globally.`
      },
      {
        q: `How does the ${name} hook generator work?`,
        a: `Our generator uses fine-tuned models trained on high-converting social media posts. It identifies patterns and words that trigger interest and puts them into scroll-stopping copy for you.`
      },
      {
        q: `How do I go viral in the ${name} niche?`,
        a: `To go viral with ${name} content, make sure your first 3 seconds use a compelling visual hook and text hook, followed by high-tempo delivery and a clear call-to-action to save or share.`
      }
    ];

    const faqsHtml = faqs
      .map(faq => `
        <div style="margin-bottom:24px;background:#1E293B;padding:24px;border-radius:16px;border:1px solid rgba(255,255,255,0.1);">
          <h3 style="font-size:1.15rem;font-weight:700;color:#F8FAFC;margin-bottom:8px;margin-top:0;">${faq.q}</h3>
          <p style="color:#94A3B8;line-height:1.6;margin:0;">${faq.a}</p>
        </div>
      `)
      .join("\n");

    const relatedNiches = [
      { id: "fitness", name: "Fitness", emoji: "🔥" },
      { id: "finance", name: "Finance", emoji: "💰" },
      { id: "business", name: "Business", emoji: "📈" },
      { id: "lifestyle", name: "Lifestyle", emoji: "✨" },
      { id: "tech", name: "Tech", emoji: "💻" },
      { id: "education", name: "Education", emoji: "📚" },
      { id: "motivation", name: "Motivation", emoji: "💪" },
      { id: "beauty", name: "Skincare", emoji: "💆" },
      { id: "social-media", name: "Social Media", emoji: "📱" },
      { id: "health", name: "Health", emoji: "🏃" }
    ];

    const relatedNichesHtml = relatedNiches
      .filter(n => n.id !== categoryId)
      .slice(0, 6)
      .map(n => `<a href="/hooks/${n.id}-${lang}" style="background:#1E293B;border:1px solid rgba(255,255,255,0.1);padding:12px 20px;border-radius:12px;color:#F8FAFC;text-decoration:none;font-weight:600;display:inline-block;margin:6px;">${n.name} Reel Hooks ${n.emoji}</a>`)
      .join(" ");

    const breadcrumbs = `
      <nav style="font-size:14px;color:#94A3B8;margin-bottom:24px;text-align:left;">
        <a href="/" style="color:#6C5CE7;text-decoration:none;">Home</a> &gt; 
        <a href="/explore" style="color:#6C5CE7;text-decoration:none;">Explore</a> &gt; 
        <span style="color:#F8FAFC;">${name} Hooks</span>
      </nav>
    `;

    bodyContent = `
      <div style="font-family:'Inter', sans-serif;background-color:#0B0F19;color:#F8FAFC;min-height:100vh;padding:40px 20px;">
        <header style="max-width:860px;margin:40px auto;padding:0;text-align:center;">
          ${breadcrumbs}
          <h1 style="font-size:36px;font-weight:800;color:#6C5CE7;line-height:1.3;margin-bottom:16px;">Free ${name} Reel Hook Generator (${displayLang})</h1>
          <p style="font-size:18px;color:#94A3B8;line-height:1.6;">${finalIntro}</p>
        </header>
        
        <main style="max-width:860px;margin:40px auto;padding:0;">
          <section style="margin-bottom:48px;">
            <h2 style="font-size:24px;font-weight:800;color:#F8FAFC;margin-bottom:24px;text-align:center;">
              10+ Best Handpicked ${name} Reel Hook Examples (Stop the Scroll)
            </h2>
            <div style="display:grid;grid-template-columns:1fr;gap:0;">
              ${exampleHooksHtml}
            </div>
          </section>

          <section style="margin-bottom:48px;color:#94A3B8;line-height:1.8;font-size:16px;">
            ${s1 ? `<div style="margin-bottom:30px;">${s1}</div>` : ""}
            ${s2 ? `<div style="margin-bottom:30px;">${s2}</div>` : ""}
            ${s3 ? `<div style="margin-bottom:30px;">${s3}</div>` : ""}
            ${sConc ? `<div>${sConc}</div>` : ""}
          </section>

          <section style="margin-bottom:48px;">
            <h2 style="font-size:24px;font-weight:800;color:#F8FAFC;margin-bottom:24px;">
              Frequently Asked Questions (FAQ) about ${name} Reel Hooks
            </h2>
            <div>
              ${faqsHtml}
            </div>
          </section>

          <section style="margin-bottom:48px;text-align:center;border-top:1px solid rgba(255,255,255,0.1);padding-top:40px;">
            <h2 style="font-size:20px;font-weight:800;color:#F8FAFC;margin-bottom:16px;">Related Niche Generators</h2>
            <div style="margin-top:12px;">
              ${relatedNichesHtml}
            </div>
          </section>
        </main>
      </div>
    `;

    schemasArray = [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.reelhooks.site/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Explore",
            "item": "https://www.reelhooks.site/explore"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": name,
            "item": canonicalUrl
          }
        ]
      }
    ];

  // 2. SEO Article pages: /:slug
  } else if (cleanPath !== "/" && SEO_ARTICLES[cleanPath.substring(1)]) {
    const slug = cleanPath.substring(1);
    const article = SEO_ARTICLES[slug];
    const interlinkedContent = enhanceArticleContentAndInterlink(article.content, slug);
    
    title = article.metaTitle || article.title;
    description = article.metaDescription;

    const faqsHtml = article.faqs
      .map(faq => `
        <div style="margin-bottom:24px;background:#1E293B;padding:24px;border-radius:16px;border:1px solid rgba(255,255,255,0.1);">
          <h3 style="font-size:1.15rem;font-weight:700;color:#F8FAFC;margin-bottom:8px;margin-top:0;">${faq.q}</h3>
          <p style="color:#94A3B8;line-height:1.6;margin:0;">${faq.a}</p>
        </div>
      `)
      .join("\n");

    const breadcrumbs = `
      <nav style="font-size:14px;color:#94A3B8;margin-bottom:24px;text-align:left;">
        <a href="/" style="color:#6C5CE7;text-decoration:none;">Home</a> &gt; 
        <span style="color:#F8FAFC;">${article.title}</span>
      </nav>
    `;

    bodyContent = `
      <div style="font-family:'Inter', sans-serif;background-color:#0B0F19;color:#F8FAFC;min-height:100vh;padding:40px 20px;">
        <main style="max-width:800px;margin:40px auto;padding:0;">
          ${breadcrumbs}
          <h1 style="font-size:36px;font-weight:800;color:#6C5CE7;line-height:1.3;margin-bottom:32px;">${article.h1}</h1>
          <div class="article-content" style="color:#94A3B8;line-height:1.8;font-size:16px;margin-bottom:48px;">
            ${interlinkedContent}
          </div>

          ${article.faqs.length > 0 ? `
          <section style="margin-bottom:48px;">
            <h2 style="font-size:24px;font-weight:800;color:#F8FAFC;margin-bottom:24px;">
              Frequently Asked Questions (FAQ)
            </h2>
            <div>
              ${faqsHtml}
            </div>
          </section>
          ` : ""}
        </main>
      </div>
    `;

    schemasArray = [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.h1,
        "description": article.metaDescription,
        "author": {
          "@type": "Organization",
          "name": "ReelHooks",
          "url": "https://www.reelhooks.site"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": article.faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }
    ];

  // 3. Tool SEO pages: /tools/:slug
  } else if (cleanPath.startsWith("/tools/") && TOOL_SEO_CONTENT[cleanPath.replace("/tools/", "")]) {
    const slug = cleanPath.replace("/tools/", "");
    const content = TOOL_SEO_CONTENT[slug];

    title = content.metaTitle || content.title;
    description = content.metaDescription;

    const faqsHtml = content.faqs
      .map(faq => `
        <div style="margin-bottom:24px;background:#1E293B;padding:24px;border-radius:16px;border:1px solid rgba(255,255,255,0.1);">
          <h3 style="font-size:1.15rem;font-weight:700;color:#F8FAFC;margin-bottom:8px;margin-top:0;">${faq.q}</h3>
          <p style="color:#94A3B8;line-height:1.6;margin:0;">${faq.a}</p>
        </div>
      `)
      .join("\n");

    const breadcrumbs = `
      <nav style="font-size:14px;color:#94A3B8;margin-bottom:24px;text-align:left;">
        <a href="/" style="color:#6C5CE7;text-decoration:none;">Home</a> &gt; 
        <span style="color:#F8FAFC;">${content.title}</span>
      </nav>
    `;

    bodyContent = `
      <div style="font-family:'Inter', sans-serif;background-color:#0B0F19;color:#F8FAFC;min-height:100vh;padding:40px 20px;">
        <main style="max-width:800px;margin:40px auto;padding:0;">
          ${breadcrumbs}
          <h1 style="font-size:36px;font-weight:800;color:#6C5CE7;line-height:1.3;margin-bottom:16px;">${content.h1}</h1>
          <p style="font-size:18px;color:#94A3B8;line-height:1.6;margin-bottom:32px;">${content.introduction}</p>

          <section style="margin-bottom:32px;color:#94A3B8;line-height:1.8;font-size:16px;">
            <h2 style="font-size:22px;color:#F8FAFC;margin-bottom:12px;">${content.featuresTitle}</h2>
            <p style="margin-bottom:24px;">${content.features}</p>

            <h2 style="font-size:22px;color:#F8FAFC;margin-bottom:12px;">${content.guideTitle}</h2>
            <p style="margin-bottom:24px;">${content.guide}</p>

            <h2 style="font-size:22px;color:#F8FAFC;margin-bottom:12px;">${content.benefitsTitle}</h2>
            <p>${content.benefits}</p>
          </section>

          <section style="margin-bottom:48px;">
            <h2 style="font-size:24px;font-weight:800;color:#F8FAFC;margin-bottom:24px;">
              Frequently Asked Questions (FAQ) about ${content.title}
            </h2>
            <div>
              ${faqsHtml}
            </div>
          </section>
        </main>
      </div>
    `;

    schemasArray = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": content.title,
        "operatingSystem": "Web",
        "applicationCategory": "MultimediaApplication",
        "url": canonicalUrl,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": content.faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }
    ];

  // 4. Blog detail posts: /blog/:slug
  } else if (cleanPath.startsWith("/blog/") && cleanPath !== "/blog") {
    const postSlug = cleanPath.replace("/blog/", "");
    const post = BLOG_POSTS.find(p => p.slug === postSlug || p.id === postSlug);
    if (post) {
      title = `${post.title} – ReelHooks AI Blog`;
      description = post.excerpt;

      const faqsHtml = post.faqs
        .map(faq => `
          <div style="margin-bottom:24px;background:#1E293B;padding:24px;border-radius:16px;border:1px solid rgba(255,255,255,0.1);">
            <h3 style="font-size:1.15rem;font-weight:700;color:#F8FAFC;margin-bottom:8px;margin-top:0;">${faq.q}</h3>
            <p style="color:#94A3B8;line-height:1.6;margin:0;">${faq.a}</p>
          </div>
        `)
        .join("\n");

      bodyContent = `
        <div style="font-family:'Inter', sans-serif;background-color:#0B0F19;color:#F8FAFC;min-height:100vh;padding:40px 20px;">
          <main style="max-width:800px;margin:40px auto;padding:0;">
            <nav style="font-size:14px;color:#94A3B8;margin-bottom:24px;text-align:left;">
              <a href="/" style="color:#6C5CE7;text-decoration:none;">Home</a> &gt; 
              <a href="/blog" style="color:#6C5CE7;text-decoration:none;">Blog</a> &gt; 
              <span style="color:#F8FAFC;">${post.title}</span>
            </nav>
            <h1 style="font-size:36px;font-weight:800;color:#6C5CE7;line-height:1.3;margin-bottom:16px;">${post.title}</h1>
            <p style="font-size:18px;color:#94A3B8;line-height:1.6;margin-bottom:32px;">${post.excerpt}</p>
            
            <div style="color:#94A3B8;line-height:1.8;font-size:16px;margin-bottom:48px;">
              ${post.content.replace(/\n/g, "<br/>")}
            </div>

            ${post.faqs.length > 0 ? `
            <section style="margin-bottom:48px;">
              <h2 style="font-size:24px;font-weight:800;color:#F8FAFC;margin-bottom:24px;">
                Frequently Asked Questions
              </h2>
              <div>
                ${faqsHtml}
              </div>
            </section>
            ` : ""}
          </main>
        </div>
      `;

      schemasArray = [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "datePublished": "2026-05-10T08:00:00+08:00",
          "author": {
            "@type": "Person",
            "name": post.author
          }
        }
      ];
    }
  }

  // Rewrite original HTML with replacements
  let revised = html;
  
  revised = revised.replace(/<title data-rh="true">.*?<\/title>/, `<title data-rh="true">${title}</title>`);
  revised = revised.replace(/<meta data-rh="true" name="description" content=".*?" \/>/, `<meta data-rh="true" name="description" content="${description}" />`);
  revised = revised.replace(/<link data-rh="true" rel="canonical" href=".*?" \/>/, `<link data-rh="true" rel="canonical" href="${canonicalUrl}" />`);
  revised = revised.replace(/<meta data-rh="true" property="og:title" content=".*?" \/>/, `<meta data-rh="true" property="og:title" content="${title}" />`);
  revised = revised.replace(/<meta data-rh="true" property="og:description" content=".*?" \/>/, `<meta data-rh="true" property="og:description" content="${description}" />`);
  revised = revised.replace(/<meta data-rh="true" property="og:url" content=".*?" \/>/, `<meta data-rh="true" property="og:url" content="${canonicalUrl}" />`);

  if (bodyContent) {
    revised = revised.replace(/<div id="root">([\s\S]*?)<\/div>/, `<div id="root">${bodyContent}</div>`);
  }

  if (schemasArray.length > 0) {
    const schemaScripts = schemasArray.map(schema => `
    <script type="application/ld+json">
    ${JSON.stringify(schema, null, 2)}
    </script>`).join("\n");
    revised = revised.replace("</head>", `${schemaScripts}\n</head>`);
  }

  return revised;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 410 Gone for /hi/ route to tell Google it's permanently removed
  app.get(["/hi", "/hi/"], (req, res) => {
    res.status(410).send("This page has been permanently removed.");
  });

  // robots.txt
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nAllow: /\nSitemap: https://www.reelhooks.site/sitemap.xml");
  });

  // sitemap.xml
  app.get("/sitemap.xml", (req, res) => {
    res.type("application/xml");
    
    const variations = ["english", "hindi", "hinglish", "instagram", "reels"];
    
    // Generate URLs for main niches
    const mainNicheUrls = NICHES.flatMap(n => 
      variations.map(v => `<url><loc>https://www.reelhooks.site/hooks/${n.id}-${v}</loc><priority>0.7</priority></url>`)
    );

    // Generate URLs for subcategories
    const subcategoryUrls = NICHES.flatMap(n => 
      n.subcategories.flatMap(s => {
        const subSlug = s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return variations.map(v => `<url><loc>https://www.reelhooks.site/hooks/${subSlug}-${v}</loc><priority>0.6</priority></url>`);
      })
    );

    // Generate URLs for tools
    const toolUrls = Object.keys(TOOL_SEO_CONTENT).map(slug => 
      `<url><loc>https://www.reelhooks.site/tools/${slug}</loc><priority>0.8</priority></url>`
    );

    // Generate URLs for articles
    const articleUrls = Object.keys(SEO_ARTICLES).map(slug => 
      `<url><loc>https://www.reelhooks.site/${slug}</loc><priority>0.8</priority></url>`
    );

    // Generate URLs for blogs
    const blogUrls = BLOG_POSTS.map(post => 
      `<url><loc>https://www.reelhooks.site/blog/${post.slug}</loc><priority>0.7</priority></url>`
    );

    const allUrls = [
      ...mainNicheUrls, 
      ...subcategoryUrls, 
      ...toolUrls, 
      ...articleUrls, 
      ...blogUrls
    ].join("\n  ");

    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.reelhooks.site/</loc><priority>1.0</priority></url>
  <url><loc>https://www.reelhooks.site/dashboard</loc><priority>0.8</priority></url>
  <url><loc>https://www.reelhooks.site/explore</loc><priority>0.9</priority></url>
  <url><loc>https://www.reelhooks.site/about</loc><priority>0.5</priority></url>
  <url><loc>https://www.reelhooks.site/blog</loc><priority>0.7</priority></url>
  ${allUrls}
</urlset>`);
  });

  // Programmatic SEO Routes
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
    
    // Fallback for SPA in dev mode
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexHtml = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");
        let template = await vite.transformIndexHtml(url, indexHtml);
        const finalHtml = renderSeoHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(finalHtml);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Serve static files in production with index fallback disabled
    app.use(express.static(path.join(__dirname, "dist"), { index: false }));
    
    app.get("*", (req, res) => {
      const url = req.path;
      try {
        const indexHtml = fs.readFileSync(path.join(__dirname, "dist", "index.html"), "utf-8");
        const finalHtml = renderSeoHtml(url, indexHtml);
        res.status(200).set({ "Content-Type": "text/html" }).send(finalHtml);
      } catch (e) {
        console.error("Error serving production HTML:", e);
        res.status(500).send("Internal Server Error");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
