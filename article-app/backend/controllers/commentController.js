import db from "../models/index.js";

const Comment = db.Comment;

/*
  ВАЖНО:
  articleId приходит НЕ из req.params,
  а из req.articleId (пробрасывается в server.js)
*/

/* ===================== CREATE ===================== */

export async function createComment(req, res) {
  try {
    const articleId = req.articleId;
    const { text } = req.body;

    if (!articleId) {
      return res.status(400).json({ error: "Article ID is missing" });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const comment = await Comment.create({
      articleId,
      text: text.trim(),
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error("CREATE COMMENT ERROR:", err);
    res.status(500).json({ error: "Failed to create comment" });
  }
}

/* ===================== LIST ===================== */

export async function getComments(req, res) {
  try {
    const articleId = req.articleId;

    if (!articleId) {
      return res.status(400).json({ error: "Article ID is missing" });
    }

    const comments = await Comment.findAll({
      where: { articleId },
      order: [["createdAt", "DESC"]],
    });

    res.json(comments);
  } catch (err) {
    console.error("GET COMMENTS ERROR:", err);
    res.status(500).json({ error: "Failed to load comments" });
  }
}

/* ===================== UPDATE ===================== */

export async function updateComment(req, res) {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    await comment.update({
      text: text.trim(),
    });

    res.json(comment);
  } catch (err) {
    console.error("UPDATE COMMENT ERROR:", err);
    res.status(500).json({ error: "Failed to update comment" });
  }
}

/* ===================== DELETE ===================== */

export async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    await comment.destroy();

    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE COMMENT ERROR:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
}
