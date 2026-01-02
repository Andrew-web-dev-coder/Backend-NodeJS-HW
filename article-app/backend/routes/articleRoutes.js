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
import { auth } from "../middleware/auth.js";

const router = Router();


// получить все статьи
router.get("/", auth, getAllArticles);

// версии статьи
router.get("/:id/versions", auth, getArticleVersions);
router.get("/:id/versions/:version", auth, getArticleVersion);

// получить статью по id
router.get("/:id", auth, getArticleById);

// создать статью
router.post(
  "/",
  auth,
  upload.array("files"),
  createArticle
);

// обновить статью
router.put(
  "/:id",
  auth,
  upload.array("files"),
  updateArticle
);

// удалить статью
router.delete("/:id", auth, deleteArticle);

export default router;
