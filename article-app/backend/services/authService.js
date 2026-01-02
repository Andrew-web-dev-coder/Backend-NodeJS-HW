import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

const { User } = db;

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES_IN = "1h";

/* =========================
   Helpers
========================= */

function isValidEmail(email) {
  // базовая, но корректная проверка
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  // минимум 8 символов
  if (typeof password !== "string") return false;
  if (password.length < 8) return false;

  // хотя бы одна буква и одна цифра
  if (!/[a-zA-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;

  return true;
}

/* =========================
   Register
========================= */

export async function register(email, password) {
  // 🔴 ВАЛИДАЦИЯ EMAIL
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  // 🔴 ВАЛИДАЦИЯ ПАРОЛЯ
  if (!isValidPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain letters and numbers"
    );
  }

  // 🔴 Проверка существования пользователя
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new Error("User already exists");
  }

  // 🔐 Хеш пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // 👤 Создание пользователя
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
}

/* =========================
   Login
========================= */

export async function login(email, password) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { token };
}
