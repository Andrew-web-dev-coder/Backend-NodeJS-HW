import * as ArticleService from "../services/articleServiceSequelize.js";
import { sendJson } from "../utils/sendJson.js";

export async function getAllArticles(req, res) {
  try {
    const articles = await ArticleService.getAll();
    sendJson(res, 200, articles);
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "Failed to read articles" });
  }
}

export async function getArticleById(req, res) {
  try {
    const article = await ArticleService.getById(req.params.id);
    if (!article) {
      return sendJson(res, 404, { error: "Article not found" });
    }
    sendJson(res, 200, article);
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "Failed to read article" });
  }
}

export async function createArticle(req, res) {
  try {
    const { title, content, workspaceId } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return sendJson(res, 400, {
        error: "Title and content are required",
      });
    }

    const article = await ArticleService.create({
      title: title.trim(),
      content: content.trim(),
      workspaceId: workspaceId || null,
      files: req.files,
    });

    sendJson(res, 201, article);
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: err.message });
  }
}

export async function updateArticle(req, res) {
  try {
    const id = req.params.id;
    const existing = await ArticleService.getById(id);

    if (!existing) {
      return sendJson(res, 404, { error: "Article not found" });
    }

    const updated = await ArticleService.update(id, {
      title: req.body.title?.trim(),
      content: req.body.content?.trim(),
      workspaceId: req.body.workspaceId ?? existing.workspaceId,
      files: req.files,
    });

    sendJson(res, 200, updated);
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "Failed to update article" });
  }
}

export async function deleteArticle(req, res) {
  try {
    const id = req.params.id;
    await ArticleService.remove(id);
    sendJson(res, 200, { message: "Article deleted" });
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "Failed to delete article" });
  }
}
