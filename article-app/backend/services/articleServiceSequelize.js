import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Op } from "sequelize";

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
    userId: article.userId,
    createdAt: article.createdAt,

    title: versionModel.title,
    content: versionModel.content,
    attachments: versionModel.attachments || [],

    version: versionModel.version,
    createdAtVersion: versionModel.createdAt,

    comments,
  };
}

/* ===================== LIST ===================== */

export async function getAll(search) {
  let articleIds = null;

  const normalizedSearch = search?.trim();

  if (normalizedSearch) {
    const versions = await ArticleVersion.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${normalizedSearch}%` } },
          { content: { [Op.iLike]: `%${normalizedSearch}%` } },
        ],
      },
      attributes: ["articleId"],
      group: ["articleId"],
    });

    articleIds = versions.map(v => v.articleId);

    if (articleIds.length === 0) return [];
  }

  const articles = await Article.findAll({
    where: articleIds ? { id: articleIds } : undefined,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: ArticleVersion,
        as: "versions",
        separate: true,
        limit: 1,
        order: [["version", "DESC"]],
      },
    ],
  });

  return articles
    .filter(article => article.versions?.length)
    .map(article => {
      const version = article.versions[0];

      return {
        id: article.id,
        workspaceId: article.workspaceId,
        userId: article.userId,
        createdAt: article.createdAt,
        title: version.title,
        content: version.content,
      };
    });
}

/* ===================== GET BY ID ===================== */

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

/* ===================== CREATE ===================== */

export async function create({
  title,
  content,
  files,
  workspaceId = null,
  userId,
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

/* ===================== UPDATE (FIXED) ===================== */

export async function update(id, { title, content, files }, user) {
  const article = await Article.findByPk(id);
  if (!article) return null;

  const articleUserId = Number(article.userId);
  const requestUserId = Number(
    user.userId ?? user.id ?? user.sub
  );

  console.log("ARTICLE USER:", articleUserId);
  console.log("REQ USER:", requestUserId);

  if (user.role !== "admin" && articleUserId !== requestUserId) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  const lastVersion = await ArticleVersion.findOne({
    where: { articleId: id },
    order: [["version", "DESC"]],
  });

  const attachments = files?.length
    ? [...lastVersion.attachments, ...mapFilesToAttachments(files)]
    : lastVersion.attachments;

  const newVersion = await ArticleVersion.create({
    articleId: id,
    version: lastVersion.version + 1,
    title: title ?? lastVersion.title,
    content: content ?? lastVersion.content,
    attachments,
  });

  return buildArticleResponse(article, newVersion);
}

/* ===================== DELETE ===================== */

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

/* ===================== VERSIONS ===================== */

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
