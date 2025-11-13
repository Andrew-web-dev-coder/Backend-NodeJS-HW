const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');


if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

class ArticleService {
  static getAll() {
    const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));

    return files.map((filename) => {
      const raw = fs.readFileSync(path.join(DATA_DIR, filename), 'utf-8');
      const article = JSON.parse(raw);

      
      return {
        id: article.id,
        title: article.title,
      };
    });
  }

  static getById(id) {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  }

  static create({ title, content }) {
    if (!title || !title.trim() || !content || !content.trim()) {
      throw new Error('Title and content are required');
    }

    const id = Date.now().toString();

    const article = {
      id,
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync(
      path.join(DATA_DIR, `${id}.json`),
      JSON.stringify(article, null, 2),
      'utf-8'
    );

    return article;
  }
}

module.exports = ArticleService;
