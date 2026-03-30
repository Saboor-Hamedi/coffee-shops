import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import apiRouter from "./server/routes.js";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // Mount Modular API Routes
  app.use("/api", apiRouter);

  // Serve Frontend
  if (process.env.NODE_ENV !== "production") {
    console.log("Initializing Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      optimizeDeps: { force: true }
    });

    // Explicitly avoid API routes in Vite middleware
    app.use((req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      vite.middlewares(req, res, next);
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api")) return res.status(404).json({ error: "API not found" });
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n\x1b[32m✔\x1b[0m Noir Roastery Server Active on http://localhost:${PORT}\n`);
  });
}

startServer().catch((err) => {
  console.error("Critical Server Error:", err);
  process.exit(1);
});
