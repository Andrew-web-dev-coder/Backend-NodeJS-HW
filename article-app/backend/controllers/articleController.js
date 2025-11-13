const ArticleService = require('../services/articleService');
const sendJson = require('../utils/sendJson');

exports.getAllArticles = (req, res) => {
  try {
    const articles = ArticleService.getAll();
    return sendJson(res, 200, articles);
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: 'Failed to read articles' });
  }
};

exports.getArticleById = (req, res) => {
  try {
    const article = ArticleService.getById(req.params.id);

    if (!article) {
      return sendJson(res, 404, { error: 'Article not found' });
    }

    return sendJson(res, 200, article);
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: 'Failed to read article' });
  }
};

exports.createArticle = (req, res) => {
  try {
    let { title, content } = req.body;


    title = typeof title === 'string' ? title.trim() : '';
    content = typeof content === 'string' ? content.trim() : '';

    if (!title || !content) {
      return sendJson(res, 400, { error: 'Title and content are required.' });
    }

 
    if (title.length < 3) {
      return sendJson(res, 400, { error: 'Title must be at least 3 characters long.' });
    }

    const article = ArticleService.create({ title, content });
    return sendJson(res, 201, article);
  } catch (err) {
    console.error(err);

    return sendJson(res, 400, { error: err.message || 'Failed to create article.' });
  }
};
