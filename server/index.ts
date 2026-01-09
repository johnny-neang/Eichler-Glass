import express from "express";
import { registerRoutes } from "./routes";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function main() {
  await registerRoutes(app);

  if (process.env.NODE_ENV === "production") {
    const staticPath = path.join(__dirname, "../dist/public");
    app.use(express.static(staticPath));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      configFile: path.join(__dirname, "../vite.config.ts"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

main().catch(console.error);
