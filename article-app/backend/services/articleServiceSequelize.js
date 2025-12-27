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


export async function getAll() {
  const articles = await Article.findAll({
    attributes: ["id", "workspaceId", "createdAt"],
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

  const comments = await Comment.findAll({
    where: { articleId: id },
    order: [["createdAt", "DESC"]],
  });

  return {
    id: article.id,
    workspaceId: article.workspaceId,
    createdAt: article.createdAt,

    title: latestVersion?.title ?? "",
    content: latestVersion?.content ?? "",
    attachments: latestVersion?.attachments ?? [],

    version: latestVersion?.version ?? 1,
    comments,
  };
}


export async function create({ title, content, files, workspaceId = null }) {
  const attachments = mapFilesToAttachments(files);

  const article = await Article.create({ workspaceId });

  await ArticleVersion.create({
    articleId: article.id,
    version: 1,
    title,
    content,
    attachments,
  });

  return getById(article.id);
}


export async function update(id, { title, content, files }) {
  const article = await Article.findByPk(id);
  if (!article) return null;

  const lastVersion = await ArticleVersion.findOne({
    where: { articleId: id },
    order: [["version", "DESC"]],
  });

  const newVersion = (lastVersion?.version ?? 0) + 1;

  const oldAttachments = lastVersion?.attachments ?? [];
  const newAttachments = files?.length
    ? oldAttachments.concat(mapFilesToAttachments(files))
    : oldAttachments;

  await ArticleVersion.create({
    articleId: id,
    version: newVersion,
    title: title ?? lastVersion.title,
    content: content ?? lastVersion.content,
    attachments: newAttachments,
  });

  return getById(id);
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


export async function getVersion(articleId, version) {
  return ArticleVersion.findOne({
    where: { articleId, version },
  });
}
