const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();

const errorHandler = require("./middleware/errorHandler");

// Route imports (we'll fill these in next)
const uploadRoutes = require("./routes/uploadRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const agentRoutes = require("./routes/agentRoutes");

const app = express();

// --- Middleware ---
app.use(cors({
  origin: "*",
  credentials: false,
}));

const rateLimit = require("express-rate-limit");

// General API limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts, please try again later." },
});

app.use("/api/", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded PDFs as static files (useful for previewing in frontend)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes ---
app.use("/api/upload", uploadRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// --- Health check ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "exam-analyzer server running" });
});

// --- Error handler (must be last) ---
app.use(errorHandler);

module.exports = app;
