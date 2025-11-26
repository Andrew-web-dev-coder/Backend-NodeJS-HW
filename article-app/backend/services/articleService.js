import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "../data");
const uploadsDir = path.join(__dirname, "../uploads");

function ensureDirectories() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
}


export function initializeArticles() {
  ensureDirectories();

  const files = fs.readdirSync(dataDir);
  if (files.length > 0) return;

  const defaultArticles = [
    {
      id: "1",
      title: "BMW M3 E46",
      content:
        "The BMW M3 E46 is a legendary sports car from the early 2000s, powered by the naturally aspirated S54 engine paired with a manual gearbox.",
      createdAt: new Date().toISOString(),
      attachments: [],
    },

    {
      id: "2",
      title: "Toyota Supra A80",
      content:
        "The Toyota Supra A80 is an iconic Japanese sports car from the 1990s, famous for its 2JZ-GTE turbocharged engine and incredible tuning potential. It became a global legend after appearing in the Fast & Furious movies.",
      createdAt: new Date().toISOString(),
      attachments: [],
    },

    {
      id: "3",
      title: "Audi RS6 Avant",
      content:
        "The Audi RS6 Avant is a high-performance station wagon combining luxury and practicality with a powerful twin-turbo V8 engine and quattro all-wheel drive.",
      createdAt: new Date().toISOString(),
      attachments: [],
    },
  ];

  for (const article of defaultArticles) {
    fs.writeFileSync(
      path.join(dataDir, `${article.id}.json`),
      JSON.stringify(article, null, 2)
    );
  }

  console.log("✅ Default articles initialized (BMW, Supra, Audi)");
}



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
      createdAt: content.createdAt,
    };
  });
}

export function getById(id) {
  const filePath = path.join(dataDir, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}


export function create({ title, content, files }) {
  ensureDirectories();

  const id = Date.now().toString();

  const attachments = (files || []).map((f) => ({
    filename: f.filename,
    
    originalname: f.originalname,
    size: f.size,
    url: `/uploads/${f.filename}`,
  }));

  const article = {
    id,
    title,
    content,
    createdAt: new Date().toISOString(),
    attachments,
  };

  fs.writeFileSync(
    path.join(dataDir, `${id}.json`),
    JSON.stringify(article, null, 2)
  );

  return article;
}

export function update(id, { title, content, files }) {
  const filePath = path.join(dataDir, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;

  const existing = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  let attachments = existing.attachments || [];


  if (files && files.length > 0) {
    const newFiles = files.map((f) => ({
      filename: f.filename,
      originalname: f.originalname,
      size: f.size,
      url: `/uploads/${f.filename}`,
    }));

    attachments = [...attachments, ...newFiles];
  }

  const updated = {
    ...existing,
  
    title: title ?? existing.title,
    content: content ?? existing.content,
    attachments,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));

  
  return updated;
}


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
