import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import db from "../models/index.js";
import { mapFilesToAttachments } from "../utils/attachments.js";

const { Article, Comment } = db;

/**
 * Resolve uploads directory
 */
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
const uploadsDir = path.join(currentDirPath, "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function initializeArticles() {
  console.log("Articles are initialized via Sequelize seed.");
}

/**
 * Get all articles (list view)
 */
export async function getAll() {
  return Article.findAll({
    attributes: ["id", "title", "createdAt", "workspaceId"],
    order: [["createdAt", "DESC"]],
  });
}

/**
 * Get single article with comments
 */
export async function getById(id) {
  return Article.findByPk(id, {
    include: [
      {
        model: Comment,
        as: "comments",
      },
    ],
    order: [[{ model: Comment, as: "comments" }, "createdAt", "DESC"]],
  });
}

/**
 * Create article
 */
export async function create({ title, content, files, workspaceId = null }) {
  const attachments = mapFilesToAttachments(files);

  return Article.create({
    title,
    content,
    attachments,
    workspaceId,
  });
}

/**
 * Update article
 */
export async function update(id, { title, content, files, workspaceId }) {
  const article = await Article.findByPk(id);
  if (!article) return null;

  let attachments = article.attachments || [];

  if (files?.length) {
    attachments = attachments.concat(mapFilesToAttachments(files));
  }

  await article.update({
    title: title ?? article.title,
    content: content ?? article.content,
    attachments,
    workspaceId: workspaceId ?? article.workspaceId,
  });

  return article;
}

/**
 * Delete article and its physical attachments
 */
export async function remove(id) {
  const article = await Article.findByPk(id);
  if (!article) return false;

  for (const file of article.attachments || []) {
    const filePath = path.join(uploadsDir, file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await article.destroy();
  return true;
}

/**
 * Remove single attachment from article
 */
export async function removeAttachment(id, attachmentFilename) {
  const article = await Article.findByPk(id);
  if (!article) return null;

  const attachments = article.attachments || [];
  const exists = attachments.find(
    (file) => file.filename === attachmentFilename
  );

  if (!exists) return null;

  const physicalPath = path.join(uploadsDir, attachmentFilename);
  if (fs.existsSync(physicalPath)) {
    fs.unlinkSync(physicalPath);
  }

  const updatedAttachments = attachments.filter(
    (file) => file.filename !== attachmentFilename
  );

  await article.update({ attachments: updatedAttachments });
  return article;
}
