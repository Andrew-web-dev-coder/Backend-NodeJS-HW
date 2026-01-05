import * as ArticleService from "../services/articleServiceSequelize.js";
import { sendJson } from "../utils/sendJson.js";


export async function getAllArticles(req, res) {
  try {
    const articles = await ArticleService.getAll();
    sendJson(res, 200, articles);
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "Failed to fetch articles" });
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
    sendJson(res, 500, { error: "Failed to fetch article" });
  }
}

export async function createArticle(req, res) {
  try {
    const { title, content, workspaceId } = req.body;

    const article = await ArticleService.create({
      title,
      content,
      workspaceId: workspaceId || null,
      files: req.files,
      userId: req.user.id, // АВТОР
    });

    sendJson(res, 201, article);
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: err.message });
  }
}


export async function updateArticle(req, res) {
  try {
    const updated = await ArticleService.update(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        files: req.files,
      },
      req.user // ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ
    );

    if (!updated) {
      return sendJson(res, 404, { error: "Article not found" });
    }

    sendJson(res, 200, updated);
  } catch (err) {
    console.error(err);

    if (err.status === 403) {
      return sendJson(res, 403, { error: "Forbidden" });
    }

    sendJson(res, 500, { error: "Failed to update article" });
  }
}


export async function deleteArticle(req, res) {
  try {
    await ArticleService.remove(req.params.id);
    sendJson(res, 200, { success: true });
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "Failed to delete article" });
  }
}



export async function getArticleVersions(req, res) {
  try {
    const versions = await ArticleService.getVersions(req.params.id);
    sendJson(res, 200, versions);
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "Failed to fetch versions" });
  }
}

export async function getArticleVersion(req, res) {
  try {
    const version = await ArticleService.getVersion(
      req.params.id,
      Number(req.params.version)
    );

    if (!version) {
      return sendJson(res, 404, { error: "Version not found" });
    }

    sendJson(res, 200, version);
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "Failed to fetch version" });
  }
}
