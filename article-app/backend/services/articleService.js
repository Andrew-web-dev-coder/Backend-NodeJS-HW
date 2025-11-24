import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "../data");
const uploadsDir = path.join(__dirname, "../uploads");

// ------------------------------------------------------------
// ENSURE DIRECTORIES
// ------------------------------------------------------------
function ensureDirectories() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
}

// ------------------------------------------------------------
// INITIALIZE DEFAULT ARTICLE (ONLY IF EMPTY)
// ------------------------------------------------------------
export function initializeArticles() {
  ensureDirectories();

  const files = fs.readdirSync(dataDir);
  if (files.length > 0) return;

  const defaultArticles = [
    {
      id: 1,
      title: "BMW M3 E46",
      content:
        "The BMW M3 E46 is a legendary sports car from the early 2000s, powered by the naturally aspirated S54 engine paired with a manual gearbox.",
      createdAt: new Date().toISOString(),
      attachments: []
    }
  ];

  for (const article of defaultArticles) {
    fs.writeFileSync(
      path.join(dataDir, `${article.id}.json`),
      JSON.stringify(article, null, 2)
    );
  }

  console.log("✅ Default articles initialized");
}

// ------------------------------------------------------------
// GET ALL
// ------------------------------------------------------------
export function getAll() {
  ensureDirectories();
  const files = fs.readdirSync(dataDir);

  return files.map((file) => {
    const content = JSON.parse(
      fs.readFileSync(path.join(dataDir, file), "utf-8")
    );
    return {
      id: content.id,
      title: content.title,
      createdAt: content.createdAt
    };
  });
}

// ------------------------------------------------------------
// GET BY ID
// ------------------------------------------------------------
export function getById(id) {
  const filePath = path.join(dataDir, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// ------------------------------------------------------------
// CREATE
// ------------------------------------------------------------
export function create({ title, content, files }) {
  ensureDirectories();

  const id = Date.now().toString();

  const attachments = (files || []).map((f) => ({
    filename: f.filename,
    originalName: f.originalname,
    size: f.size,
    url: `/uploads/${f.filename}`
  }));

  const article = {
    id,
    title,
    content,
    createdAt: new Date().toISOString(),
    attachments
  };

  fs.writeFileSync(
    path.join(dataDir, `${id}.json`),
    JSON.stringify(article, null, 2)
  );

  return article;
}

// ------------------------------------------------------------
// UPDATE (FIXED VERSION)
// ------------------------------------------------------------
export function update(id, { title, content, files }) {
  const filePath = path.join(dataDir, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;

  const existing = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  let attachments = existing.attachments || [];
  let newFiles = [];

  // New uploaded files — append, not replace
  if (files && files.length > 0) {
    newFiles = files.map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
      url: `/uploads/${f.filename}`
    }));

    attachments = [...attachments, ...newFiles];
  }

  const updated = {
    ...existing,
    title: title !== undefined ? title : existing.title,
    content: content !== undefined ? content : existing.content,
    attachments,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));

  // *** важная правка ***
  return {
    article: updated,
    newFiles
  };
}

// ------------------------------------------------------------
// REMOVE ARTICLE
// ------------------------------------------------------------
export function remove(id) {
  const filePath = path.join(dataDir, `${id}.json`);
  if (!fs.existsSync(filePath)) return false;

  const article = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (article.attachments?.length) {
    for (const file of article.attachments) {
      const p = path.join(uploadsDir, file.filename);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  }

  fs.unlinkSync(filePath);
  return true;
}

// ------------------------------------------------------------
// REMOVE ONE ATTACHMENT
// ------------------------------------------------------------
export function removeAttachment(id, filename) {
  const filePath = path.join(dataDir, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;

  const article = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const exists = article.attachments.find((a) => a.filename === filename);
  if (!exists) return null;

  const physical = path.join(uploadsDir, filename);
  if (fs.existsSync(physical)) fs.unlinkSync(physical);

  article.attachments = article.attachments.filter(
    (f) => f.filename !== filename
  );

  fs.writeFileSync(filePath, JSON.stringify(article, null, 2));

  return article;
}
