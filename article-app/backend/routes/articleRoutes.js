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



router.get("/", auth, getAllArticles);


router.get("/:id/versions", auth, getArticleVersions);
router.get("/:id/versions/:version", auth, getArticleVersion);


router.get("/:id", auth, getArticleById);


router.post(
  "/",
  auth,
  upload.array("files"),
  createArticle
);


router.put(
  "/:id",
  auth,
  upload.array("files"),
  updateArticle
);


router.delete("/:id", auth, deleteArticle);

export default router;
