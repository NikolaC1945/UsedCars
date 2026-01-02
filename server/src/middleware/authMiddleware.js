import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ BITNO: ISTI FORMAT KAO authRequired
    req.user = { id: decoded.userId };
  } catch {
    req.user = null;
  }

  next();
}

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ JEDINSTVEN FORMAT
    req.user = { id: decoded.userId };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
