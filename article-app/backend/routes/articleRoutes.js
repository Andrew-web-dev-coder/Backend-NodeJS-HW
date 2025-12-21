import { Router } from "express";
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", getAllArticles);
router.get("/:id", getArticleById);
router.post("/", upload.array("files"), createArticle);
router.put("/:id", upload.array("files"), updateArticle);
router.delete("/:id", deleteArticle);

export default router;
