import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import db from "../models/index.js";
import { mapFilesToAttachments } from "../utils/attachments.js";

const { Article, ArticleVersion, Comment } = db;

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
const uploadsDir = path.join(currentDirPath, "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

async function buildArticleResponse(article, versionModel) {
  const comments = await Comment.findAll({
    where: { articleId: article.id },
    order: [["createdAt", "DESC"]],
  });

  return {
    id: article.id,
    workspaceId: article.workspaceId,
    userId: article.userId, //  Author
    createdAt: article.createdAt,

    title: versionModel.title,
    content: versionModel.content,
    attachments: versionModel.attachments || [],

    version: versionModel.version,
    createdAtVersion: versionModel.createdAt,

    comments,
  };
}

export async function getAll() {
  const articles = await Article.findAll({
    attributes: ["id", "workspaceId", "userId", "createdAt"],
    order: [["createdAt", "DESC"]],
  });

  const result = [];

  for (const article of articles) {
    const latestVersion = await ArticleVersion.findOne({
      where: { articleId: article.id },
      order: [["version", "DESC"]],
    });

    result.push({
      id: article.id,
      workspaceId: article.workspaceId,
      userId: article.userId,
      createdAt: article.createdAt,
      title: latestVersion?.title ?? "(no title)",
    });
  }

  return result;
}

export async function getById(id) {
  const article = await Article.findByPk(id);
  if (!article) return null;

  const latestVersion = await ArticleVersion.findOne({
    where: { articleId: id },
    order: [["version", "DESC"]],
  });

  if (!latestVersion) return null;

  return buildArticleResponse(article, latestVersion);
}

export async function create({
  title,
  content,
  files,
  workspaceId = null,
  userId, // автор
}) {
  const attachments = mapFilesToAttachments(files);

  const article = await Article.create({
    workspaceId,
    userId,
  });

  const version = await ArticleVersion.create({
    articleId: article.id,
    version: 1,
    title,
    content,
    attachments,
  });

  return buildArticleResponse(article, version);
}


export async function update(id, { title, content, files }, user) {
  const article = await Article.findByPk(id);
  if (!article) return null;

 
  if (
    user.role !== "admin" &&
    article.userId !== user.id
  ) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  const lastVersion = await ArticleVersion.findOne({
    where: { articleId: id },
    order: [["version", "DESC"]],
  });

  const newVersionNumber = lastVersion.version + 1;

  const attachments = files?.length
    ? lastVersion.attachments.concat(mapFilesToAttachments(files))
    : lastVersion.attachments;

  const newVersion = await ArticleVersion.create({
    articleId: id,
    version: newVersionNumber,
    title: title ?? lastVersion.title,
    content: content ?? lastVersion.content,
    attachments,
  });

  return buildArticleResponse(article, newVersion);
}

export async function remove(id) {
  const article = await Article.findByPk(id);
  if (!article) return false;

  const versions = await ArticleVersion.findAll({
    where: { articleId: id },
  });

  for (const version of versions) {
    for (const file of version.attachments || []) {
      const filePath = path.join(uploadsDir, file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  await article.destroy();
  return true;
}

export async function getVersions(articleId) {
  return ArticleVersion.findAll({
    where: { articleId },
    order: [["version", "DESC"]],
    attributes: ["version", "createdAt"],
  });
}

export async function getVersion(articleId, versionNumber) {
  const article = await Article.findByPk(articleId);
  if (!article) return null;

  const version = await ArticleVersion.findOne({
    where: { articleId, version: versionNumber },
  });

  if (!version) return null;

  return buildArticleResponse(article, version);
}
