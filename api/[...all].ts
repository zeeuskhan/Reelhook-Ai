import type { Request, Response } from "express";
import app from "../server.ts";

// Vercel rewrites public page URLs through /api/serve/* so Express can
// render route-specific SEO HTML while preserving normal /api/* endpoints.
export default function handler(req: Request, res: Response) {
  if (req.url?.startsWith("/api/serve/")) {
    req.url = req.url.replace(/^\/api\/serve/, "") || "/";
  } else if (req.url === "/api/serve" || req.url?.startsWith("/api/serve?")) {
    req.url = req.url.replace(/^\/api\/serve/, "") || "/";
  }
  return app(req, res);
}
