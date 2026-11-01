import type { Request, Response } from "express";
import app from "../server.bundle.js";

// Vercel's non-Next.js API routes do not support [...catch-all] filenames.
// Vercel rewrites send the original pathname through the __route query value.
export default function handler(req: Request, res: Response) {
  const requestUrl = new URL(req.url || "/", "http://localhost");
  const forwardedPath = requestUrl.searchParams.get("__route") || "";

  // Remove the internal routing parameter and preserve the visitor's query string.
  requestUrl.searchParams.delete("__route");

  // Prevent path traversal while preserving nested route segments.
  const safePath = forwardedPath
    .replace(/^\/+/, "")
    .split("/")
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .join("/");

  req.url = `/${safePath}${requestUrl.search}`;
  return app(req, res);
}
