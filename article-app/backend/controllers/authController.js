import * as AuthService from "../services/authService.js";
import { sendJson } from "../utils/sendJson.js";

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendJson(res, 400, {
        message: "Email and password required",
      });
    }

    const user = await AuthService.register(email, password);

    return sendJson(res, 201, user);
  } catch (e) {
    
    console.error("REGISTER ERROR:", e);

    return sendJson(res, 400, {
      message: e.message || "Registration failed",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendJson(res, 400, {
        message: "Email and password required",
      });
    }

    const result = await AuthService.login(email, password);

    return sendJson(res, 200, result);
  } catch (e) {
    console.error("LOGIN ERROR:", e);

    return sendJson(res, 401, {
      message: e.message || "Login failed",
    });
  }
}
