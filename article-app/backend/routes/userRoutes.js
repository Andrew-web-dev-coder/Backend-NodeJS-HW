import express from "express";
import { auth, adminOnly } from "../middleware/auth.js";
import {
  getAllUsers,
  updateUserRole,
} from "../controllers/userController.js";

const router = express.Router();

// Admins only
router.get("/", auth, adminOnly, getAllUsers);
router.patch("/:id/role", auth, adminOnly, updateUserRole);
 
export default router;
