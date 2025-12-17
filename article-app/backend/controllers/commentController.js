import db from "../models/index.js";
const Comment = db.Comment;


export async function createComment(req, res) {
  try {
    const { id } = req.params; 
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const comment = await Comment.create({
      articleId: id,
      text,
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create comment" });
  }
}


export async function getComments(req, res) {
  try {
    const { id } = req.params;

    const comments = await Comment.findAll({
      where: { articleId: id },
      order: [["createdAt", "DESC"]],
    });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load comments" });
  }
}


export async function updateComment(req, res) {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    await comment.update({ text });
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update comment" });
  }
}


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
    console.error(err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
}
