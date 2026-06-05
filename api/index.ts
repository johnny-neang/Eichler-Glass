import express from "express";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { registerRoutes } from "../server/routes";

// Single Express app reused across warm serverless invocations on Vercel.
// All /api/* requests are rewritten to this function (see vercel.json), and
// Express matches them against the routes registered below.
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ready = registerRoutes(app);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ready;
  return app(req as unknown as express.Request, res as unknown as express.Response);
}
