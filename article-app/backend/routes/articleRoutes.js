import { Router } from "express";
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleVersions,
  getArticleVersion,
} from "../controllers/articleController.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", getAllArticles);
router.get("/:id/versions", getArticleVersions);
router.get("/:id/versions/:version", getArticleVersion);
router.get("/:id", getArticleById);
router.post("/", upload.array("files"), createArticle);
router.put("/:id", upload.array("files"), updateArticle);
router.delete("/:id", deleteArticle);

export default router;
