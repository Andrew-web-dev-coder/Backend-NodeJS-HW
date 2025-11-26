import express from "express";
import cors from "cors";
import multer from "multer";
import { WebSocketServer } from "ws";

import * as ArticleService from "./services/articleService.js";
import { initializeArticles } from "./services/articleService.js";

const app = express();
const PORT = 4000;
const WSPORT = 4001;


const wss = new WebSocketServer({ port: WSPORT });
console.log(`🔌 WebSocket server running on ws://localhost:${WSPORT}`);

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(msg);
  });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({ storage, fileFilter });


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


initializeArticles();


app.post("/articles", upload.array("files"), (req, res) => {
  try {
    const article = ArticleService.create({
      title: req.body.title,
      content: req.body.content,
      files: req.files || [],
    });

    broadcast({
      type: "article_created",
      id: article.id,
      title: article.title,
      message: `🆕 Article created: "${article.title}"`,
    });

    res.status(201).json(article);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create" });
  }
});


app.put("/articles/:id", upload.array("files"), (req, res) => {
  try {
    const updated = ArticleService.update(req.params.id, {
      title: req.body.title,
      content: req.body.content,
      files: req.files || [],
    });

    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }

    broadcast({
      type: "article_updated",
      id: updated.id,
      title: updated.title,
      message: `✏ Article updated: "${updated.title}"`,
    });

    
    const newFiles = req.files?.map((f) => f.originalname) || [];
    if (newFiles.length > 0) {
      broadcast({
        type: "file_added",
        id: updated.id,
        title: updated.title,
        files: newFiles,
        message: `📎 New file(s) added to "${updated.title}"`,
      });
    }

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update" });
  }
});


app.delete("/articles/:id/attachments/:filename", (req, res) => {
  try {
    const decoded = decodeURIComponent(req.params.filename);

    const updated = ArticleService.removeAttachment(req.params.id, decoded);
    if (!updated) return res.status(404).json({ error: "Not found" });

    broadcast({
      type: "attachment_removed",
      id: updated.id,
      filename: decoded,
      message: `❌ Attachment removed: ${decoded}`,
    });

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete attachment" });
  }
});


app.get("/articles", (req, res) => {
  res.json(ArticleService.getAll());
});


app.get("/articles/:id", (req, res) => {
  const item = ArticleService.getById(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});


app.delete("/articles/:id", (req, res) => {
  const result = ArticleService.remove(req.params.id);
  if (!result) return res.status(404).json({ error: "Not found" });

  broadcast({
    type: "article_deleted",
    id: req.params.id,
    message: `🗑 Article deleted`,
  });

  res.json({ message: "Deleted" });
});

app.listen(PORT, () =>
  console.log(`🚀 REST API running at http://localhost:${PORT}`)
);
