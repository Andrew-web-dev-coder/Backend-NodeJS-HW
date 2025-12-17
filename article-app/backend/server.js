import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";


import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "./controllers/commentController.js";

import * as workspaceController from "./controllers/workspaceController.js";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "./services/articleServiceSequelize.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;
const WSPORT = 4001;


const wss = new WebSocketServer({ port: WSPORT });

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(msg);
  });
}


app.use(cors());
app.use(express.json());


const uploadsDir = path.join(__dirname, "uploads");

app.use("/uploads", express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({ storage });


app.get("/workspaces", workspaceController.getAllWorkspaces);
app.post("/workspaces", workspaceController.createWorkspace);
app.get("/workspaces/:id", workspaceController.getWorkspaceById);
app.put("/workspaces/:id", workspaceController.updateWorkspace);
app.delete("/workspaces/:id", workspaceController.deleteWorkspace);


app.get("/articles", async (_req, res) => {
  const articles = await getAll();
  res.json(articles);
});

app.get("/articles/:id", async (req, res) => {
  const article = await getById(req.params.id);
  if (!article) return res.status(404).json({ error: "Not found" });
  res.json(article);
});

app.post("/articles", upload.array("files"), async (req, res) => {
  try {
    const { title, content, workspaceId } = req.body;

    const article = await create({
      title,
      content,
      workspaceId,
      files: req.files,
    });

    broadcast({
      type: "article_created",
      message: `🆕 Article created: "${article.title}"`,
    });

    res.status(201).json(article);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Create failed" });
  }
});

app.put("/articles/:id", upload.array("files"), async (req, res) => {
  try {
    const updated = await update(req.params.id, {
      title: req.body.title,
      content: req.body.content,
      files: req.files,
    });

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Update failed" });
  }
});

app.delete("/articles/:id", async (req, res) => {
  await remove(req.params.id);
  res.json({ ok: true });
});




app.get("/articles/:id/comments", getComments);


app.post("/articles/:id/comments", createComment);


app.put("/comments/:commentId", updateComment);


app.delete("/comments/:commentId", deleteComment);

app.listen(PORT, () => {
  console.log(`🚀 REST API running at http://localhost:${PORT}`);
  console.log(`Uploads dir: ${uploadsDir}`);
});
