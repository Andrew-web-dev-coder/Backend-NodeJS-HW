import * as ArticleService from "../services/articleServiceSequelize.js";
import { sendJson } from "../utils/sendJson.js";


export async function getAllArticles(req, res) {
  try {
    const articles = await ArticleService.getAll();
    return sendJson(res, 200, articles);
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to read articles" });
  }
}


export async function getArticleById(req, res) {
  try {
    const article = await ArticleService.getById(req.params.id);

    if (!article) {
      return sendJson(res, 404, { error: "Article not found" });
    }

    return sendJson(res, 200, article);
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to read article" });
  }
}


export async function createArticle(req, res) {
  try {
    let { title, content } = req.body;

    title = typeof title === "string" ? title.trim() : "";
    content = typeof content === "string" ? content.trim() : "";

    if (!title || !content) {
      return sendJson(res, 400, { error: "Title and content are required." });
    }

    if (title.length < 3) {
      return sendJson(res, 400, { error: "Title must be at least 3 characters long." });
    }

    const article = await ArticleService.create({ title, content });

    return sendJson(res, 201, article);
  } catch (err) {
    console.error(err);
    return sendJson(res, 400, { error: err.message });
  }
}


export async function updateArticle(req, res) {
  try {
    const id = req.params.id;
    const existing = await ArticleService.getById(id);

    if (!existing) {
      return sendJson(res, 404, { error: "Article not found." });
    }

    let { title, content } = req.body;

    title = typeof title === "string" ? title.trim() : null;
    content = typeof content === "string" ? content.trim() : null;

    if (!title && !content) {
      return sendJson(res, 400, { error: "At least one field must be provided." });
    }

    const updated = await ArticleService.update(id, { title, content });

    return sendJson(res, 200, updated);
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to update article." });
  }
}


export async function deleteArticle(req, res) {
  try {
    const id = req.params.id;
    const existing = await ArticleService.getById(id);

    if (!existing) {
      return sendJson(res, 404, { error: "Article not found." });
    }

    const removed = await ArticleService.remove(id);

    if (!removed) {
      return sendJson(res, 500, { error: "Failed to delete article." });
    }

    return sendJson(res, 200, { message: `Article ${id} deleted successfully.` });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to delete article." });
  }
}
