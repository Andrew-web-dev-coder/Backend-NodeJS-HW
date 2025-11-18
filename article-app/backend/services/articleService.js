import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "../data");

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
}


export function initializeArticles() {
  ensureDataDir();
  const files = fs.readdirSync(dataDir);
  if (files.length > 0) return;

  const defaultArticles = [
    {
      id: 1,
      title: "BMW M3 E46",
      content:
        "The BMW M3 E46 is a legendary sports car from the early 2000s, powered by the naturally aspirated S54 engine paired with a manual gearbox. It became an icon for its perfect balance of performance and handling.",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Audi RS6 Avant",
      content:
        "The Audi RS6 Avant is a high-performance wagon combining luxury and raw power. With its twin-turbo V8 and quattro all-wheel drive, it blends family practicality with sports car performance.",
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Toyota Supra A80",
      content:
        "The Toyota Supra A80 is an iconic Japanese sports car from the 1990s, famous for its 2JZ-GTE turbocharged engine and incredible tuning potential. It became a global legend after appearing in the Fast & Furious movies.",
      createdAt: new Date().toISOString(),
    },
  ];

  for (const article of defaultArticles) {
    const filePath = path.join(dataDir, `${article.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(article, null, 2));
  }

  console.log("✅ Default English car articles created in /data/");
}


export function getAll() {
  ensureDataDir();
  const files = fs.readdirSync(dataDir);
  return files.map((file) => {
    const content = fs.readFileSync(path.join(dataDir, file), "utf-8");
    const { id, title, createdAt } = JSON.parse(content);
    return { id, title, createdAt };
  });
}


export function getById(id) {
  const filePath = path.join(dataDir, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

export function create({ title, content }) {
  ensureDataDir();
  const id = Date.now().toString();
  const newArticle = {
    id,
    title,
    content,
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    path.join(dataDir, `${id}.json`),
    JSON.stringify(newArticle, null, 2)
  );
  return newArticle;
}


export function update(id, { title, content }) {
  const filePath = path.join(dataDir, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;

  const existing = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const updated = {
    ...existing,
    title: title || existing.title,
    content: content || existing.content,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  return updated;
}


export function remove(id) {
  const filePath = path.join(dataDir, `${id}.json`);
  if (!fs.existsSync(filePath)) return false;

  fs.unlinkSync(filePath);
  return true;
}
