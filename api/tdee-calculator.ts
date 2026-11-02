import type { Request, Response } from "express";
import app from "../server.ts";

// Dedicated entry point for the canonical TDEE route. Vercel's public
// rewrite maps /tdee-calculator here so the page is handled by Express
// rather than depending on a catch-all function match.
export default function handler(req: Request, res: Response) {
  req.url = "/tdee-calculator";
  return app(req, res);
}
