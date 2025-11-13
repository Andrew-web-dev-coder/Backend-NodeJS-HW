import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());


const dataDir = path.resolve("data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

function loadArticles() {
  const files = fs.readdirSync(dataDir);
  return files.map((file) => {
    const content = fs.readFileSync(path.join(dataDir, file), "utf-8");
    return JSON.parse(content);
  });
}


function initializeArticles() {
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


initializeArticles();


app.get("/articles", (req, res) => {
  const articles = loadArticles();
  res.json(articles);
});


app.get("/articles/:id", (req, res) => {
  const id = req.params.id;
  const filePath = path.join(dataDir, `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Not found" });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  res.json(JSON.parse(content));
});


app.post("/articles", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

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

  res.status(201).json(newArticle);
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
