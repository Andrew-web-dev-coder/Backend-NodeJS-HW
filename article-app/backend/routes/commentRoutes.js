import express from "express";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/articles/:id/comments", getComments);
router.post("/articles/:id/comments", createComment);
router.put("/comments/:commentId", updateComment);
router.delete("/comments/:commentId", deleteComment);

export default router;
