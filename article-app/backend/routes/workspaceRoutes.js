import express from "express";
import * as workspaceController from "../controllers/workspaceController.js";

const router = express.Router();

router.get("/", workspaceController.getAllWorkspaces);
router.post("/", workspaceController.createWorkspace);
router.get("/:id", workspaceController.getWorkspaceById);
router.put("/:id", workspaceController.updateWorkspace);
router.delete("/:id", workspaceController.deleteWorkspace);

export default router;