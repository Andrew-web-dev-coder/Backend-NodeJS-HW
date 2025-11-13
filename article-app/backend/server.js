import express from "express";
import cors from "cors";
import * as articleController from "./controllers/articleController.js";
import { initializeArticles } from "./services/articleService.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());


initializeArticles();


app.get("/articles", articleController.getAllArticles);
app.get("/articles/:id", articleController.getArticleById);
app.post("/articles", articleController.createArticle);
app.put("/articles/:id", articleController.updateArticle);
app.delete("/articles/:id", articleController.deleteArticle);

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});

app.put("/articles/:id", (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;

  const article = articles.find(a => a.id == id);

  if (!article) {
    return sendJson(res, 404, { error: "Article not found" });
  }

  if (!title?.trim() || !content?.trim()) {
    return sendJson(res, 400, { error: "Title and content are required" });
  }

  article.title = title;
  article.content = content;

  sendJson(res, 200, { message: "Updated successfully", article });
});

app.delete("/articles/:id", (req, res) => {
  const id = req.params.id;
  const index = articles.findIndex(a => a.id == id);

  if (index === -1) {
    return sendJson(res, 404, { error: "Article not found" });
  }

  articles.splice(index, 1);

  sendJson(res, 200, { message: "Deleted successfully" });
});

