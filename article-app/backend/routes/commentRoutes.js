import express from "express";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();


router.get("/", getComments);
router.post("/", createComment);

router.put("/:commentId", updateComment);
router.delete("/:commentId", deleteComment);

export default router;
