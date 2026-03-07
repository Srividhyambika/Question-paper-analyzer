const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect any route — requires valid JWT
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    return next(new Error("Not authorized. No token provided."));
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      res.status(401);
      return next(new Error("User not found."));
    }
    next();
  } catch {
    res.status(401);
    return next(new Error("Not authorized. Invalid token."));
  }
};

// Admin only — use after protect
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    res.status(403);
    return next(new Error("Admin access required."));
  }
  next();
};

module.exports = { protect, adminOnly };
