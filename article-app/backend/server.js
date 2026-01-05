import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";

import articleRoutes from "./routes/articleRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;
const WSPORT = 4001;

/* WebSocket */
const wss = new WebSocketServer({ port: WSPORT });

export function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
}

/* Middlewares */
app.use(cors());
app.use(express.json());

/* Static uploads */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* Routes */
app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);
app.use("/articles/:id/comments", commentRoutes);
app.use("/workspaces", workspaceRoutes);
app.use("/users", userRoutes); 

app.listen(PORT, () => {
  console.log(`🚀 REST API running at http://localhost:${PORT}`);
});

