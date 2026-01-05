import db from "../models/index.js";
import { sendJson } from "../utils/sendJson.js";

const { User } = db;

export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "role", "createdAt"],
      order: [["id", "ASC"]],
    });

    sendJson(res, 200, users);
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "Failed to fetch users" });
  }
}


export async function updateUserRole(req, res) {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!["admin", "user"].includes(role)) {
      return sendJson(res, 400, { error: "Invalid role" });
    }

    if (Number(id) === req.user.id) {
      return sendJson(res, 400, { error: "You cannot change your own role" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return sendJson(res, 404, { error: "User not found" });
    }

    user.role = role;
    await user.save();

    sendJson(res, 200, {
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "Failed to update user role" });
  }
}
