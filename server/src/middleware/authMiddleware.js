import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing." });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid Authorization header format." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // attach user info to request
    req.user = {
      id: payload.userId,
      email: payload.email,
    };

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
