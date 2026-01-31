import multer from "multer";
import path from "path";
import fs from "fs";

import { getDirname } from "../utils/paths.js";

const uploadDir = path.join(getDirname(import.meta.url), "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only images and PDFs are allowed"));
    } else {
      cb(null, true);
    }
  },
});
