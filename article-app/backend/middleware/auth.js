import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export function auth(req, res, next) {
  console.log("AUTH HEADER:", req.headers.authorization);

  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "No token provided" });
  }

  const [type, token] = header.split(" ");

  console.log("TYPE:", type);
  console.log("TOKEN:", token);

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    console.error("JWT ERROR:", e.message);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
}
