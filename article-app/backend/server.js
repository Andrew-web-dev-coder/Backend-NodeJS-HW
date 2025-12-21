import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";

import articleRoutes from "./routes/articleRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);

const app = express();
const PORT = 4000;
const WSPORT = 4001;

/* WebSocket */
const wss = new WebSocketServer({ port: WSPORT });

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(msg);
  });
}

app.use(cors());
app.use(express.json());

/* Static uploads */
const uploadsDir = path.join(currentDir, "uploads");
app.use("/uploads", express.static(uploadsDir));

/* Routes */
app.use("/articles", articleRoutes);
app.use("/articles/:id/comments", commentRoutes);
app.use("/workspaces", workspaceRoutes);

app.listen(PORT, () => {
  console.log(`🚀 REST API running at http://localhost:${PORT}`);
});
