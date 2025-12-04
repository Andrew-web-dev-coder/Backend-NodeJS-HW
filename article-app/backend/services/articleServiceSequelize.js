import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import db from "../models/index.js";
const Article = db.Article;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "../uploads");


if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

export async function initializeArticles() {
  const count = await Article.count();

  if (count > 0) return; 

  for (const article of defaultArticles) {
    await Article.create({
      title: article.title,
      content: article.content,
    });
  }

  console.log("✅ Default articles saved into PostgreSQL");
}


export async function getAll() {
  return await Article.findAll({
    attributes: ["id", "title", "createdAt"],
    order: [["createdAt", "DESC"]],
  });
}


export async function getById(id) {
  return await Article.findByPk(id);
}


export async function create({ title, content, files }) {
  const attachments = (files || []).map((f) => ({
    filename: f.filename,
    originalname: f.originalname,
    size: f.size,
    url: `/uploads/${f.filename}`,
  }));

  const article = await Article.create({
    title,
    content,
    attachments,
  });

  return article;
}


export async function update(id, { title, content, files }) {
  const article = await Article.findByPk(id);
  if (!article) return null;

  let attachments = article.attachments || [];

  if (files && files.length > 0) {
    const newFiles = files.map((f) => ({
      filename: f.filename,
      originalname: f.originalname,
      size: f.size,
      url: `/uploads/${f.filename}`,
    }));

    attachments = [...attachments, ...newFiles];
  }

  await article.update({
    title: title ?? article.title,
    content: content ?? article.content,
    attachments,
  });

  return article;
}


export async function remove(id) {
  const article = await Article.findByPk(id);
  if (!article) return false;

  
  if (article.attachments?.length) {
    for (const file of article.attachments) {
      const p = path.join(uploadsDir, file.filename);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  }

  await article.destroy();
  return true;
}


export async function removeAttachment(id, filename) {
  const article = await Article.findByPk(id);
  if (!article) return null;

  const exists = (article.attachments || []).find(
    (f) => f.filename === filename
  );
  if (!exists) return null;

  
  const physical = path.join(uploadsDir, filename);
  if (fs.existsSync(physical)) fs.unlinkSync(physical);

  
  const updated = article.attachments.filter(
    (f) => f.filename !== filename
  );

  await article.update({ attachments: updated });

  return article;
}
