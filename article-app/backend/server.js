import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

import {
  getAll,
  getById,
  create,
  update,
  remove,
  initializeArticles
} from "./services/articleServiceSequelize.js";

const app = express();
const PORT = 4000;
const WSPORT = 4001;


const wss = new WebSocketServer({ port: WSPORT });
console.log(`🔌 WebSocket server running on ws://localhost:${WSPORT}`);

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(msg);
  });
}


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


initializeArticles();




app.get("/articles", async (req, res) => {
  try {
    const articles = await getAll();
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load articles" });
  }
});


app.get("/articles/:id", async (req, res) => {
  try {
    const article = await getById(req.params.id);
    if (!article) return res.status(404).json({ error: "Not found" });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load article" });
  }
});


app.post("/articles", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const article = await create({ title, content });

    broadcast({
      type: "article_created",
      id: article.id,
      title: article.title,
      message: `🆕 Article created: "${article.title}"`,
    });

    res.status(201).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create article" });
  }
});


app.put("/articles/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content } = req.body;

    const updated = await update(id, { title, content });
    if (!updated) return res.status(404).json({ error: "Article not found" });

    broadcast({
      type: "article_updated",
      id,
      title: updated.title,
      message: `✏️ Article updated: "${updated.title}"`,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update article" });
  }
});


app.delete("/articles/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const success = await remove(id);
    if (!success) return res.status(404).json({ error: "Not found" });

    broadcast({
      type: "article_deleted",
      id,
      message: "🗑 Article deleted",
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete article" });
  }
});


app.listen(PORT, () =>
  console.log(`🚀 REST API running at http://localhost:${PORT}`)
);
