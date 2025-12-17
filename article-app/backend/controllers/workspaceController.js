import db from "../models/index.js";

// GET /workspaces
export async function getAllWorkspaces(req, res) {
  try {
    const workspaces = await db.Workspace.findAll({
      order: [["id", "ASC"]],
    });
    res.json(workspaces);
  } catch (err) {
    console.error("getAllWorkspaces error:", err);
    res.status(500).json({ error: "Failed to load workspaces" });
  }
}

// GET /workspaces/:id
export async function getWorkspaceById(req, res) {
  try {
    const workspace = await db.Workspace.findByPk(req.params.id);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }
    res.json(workspace);
  } catch (err) {
    console.error("getWorkspaceById error:", err);
    res.status(500).json({ error: "Failed to load workspace" });
  }
}

// POST /workspaces
export async function createWorkspace(req, res) {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const workspace = await db.Workspace.create({ name: name.trim() });
    res.status(201).json(workspace);
  } catch (err) {
    console.error("createWorkspace error:", err);
    res.status(500).json({ error: "Failed to create workspace" });
  }
}

// PUT /workspaces/:id
export async function updateWorkspace(req, res) {
  try {
    const { name } = req.body;
    const workspace = await db.Workspace.findByPk(req.params.id);

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    await workspace.update({ name });
    res.json(workspace);
  } catch (err) {
    console.error("updateWorkspace error:", err);
    res.status(500).json({ error: "Failed to update workspace" });
  }
}

// DELETE /workspaces/:id
export async function deleteWorkspace(req, res) {
  try {
    const workspace = await db.Workspace.findByPk(req.params.id);

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    await workspace.destroy();
    res.json({ message: "Workspace deleted" });
  } catch (err) {
    console.error("deleteWorkspace error:", err);
    res.status(500).json({ error: "Failed to delete workspace" });
  }
}
