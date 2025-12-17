import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../models/index.js";

const { Article, Comment } = db;

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const uploadsDir = path.join(dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


export async function initializeArticles() {
  console.log("✅ Articles are initialized via Sequelize seed.");
}



export async function getAll() {
  return Article.findAll({
    attributes: ["id", "title", "createdAt", "workspaceId"],
    order: [["createdAt", "DESC"]],
  });
}

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

export async function create({ title, content, files, workspaceId = null }) {
  const attachments = (files || []).map((f) => ({
    filename: f.filename,
    originalname: f.originalname,
    size: f.size,
    url: `/uploads/${f.filename}`,
  }));

  return Article.create({
    title,
    content,
    attachments,
    workspaceId,
  });
}

export async function update(id, { title, content, files, workspaceId }) {
  const article = await Article.findByPk(id);
  if (!article) return null;

  let attachments = article.attachments || [];

  if (files?.length) {
    attachments = attachments.concat(
      files.map((f) => ({
        filename: f.filename,
        originalname: f.originalname,
        size: f.size,
        url: `/uploads/${f.filename}`,
      }))
    );
  }

  await article.update({
    title: title ?? article.title,
    content: content ?? article.content,
    attachments,
    workspaceId: workspaceId ?? article.workspaceId,
  });

  return article;
}

export async function remove(id) {
  const article = await Article.findByPk(id);
  if (!article) return false;

  for (const file of article.attachments || []) {
    const p = path.join(uploadsDir, file.filename);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  await article.destroy();
  return true;
}

export async function removeAttachment(id, filename) {
  const article = await Article.findByPk(id);
  if (!article) return null;

  const attachments = article.attachments || [];
  const exists = attachments.find((f) => f.filename === filename);
  if (!exists) return null;

  const physical = path.join(uploadsDir, filename);
  if (fs.existsSync(physical)) fs.unlinkSync(physical);

  const updated = attachments.filter((f) => f.filename !== filename);
  await article.update({ attachments: updated });

  return article;
}
