const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validatePassword, classifyStrength } = require("../utils/passwordUtils");

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { username, password, dob, role } = req.body;

    if (!username || !password || !dob) {
      res.status(400);
      return next(new Error("Username, password, and date of birth are required."));
    }

    // Regex + security validation
    const errors = validatePassword(password, username, dob);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Password validation failed.", errors });
    }

    // Check duplicate username
    const existing = await User.findOne({ username });
    if (existing) {
      res.status(400);
      return next(new Error("Username already taken."));
    }

    // Hash password — never store plaintext
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      dob,
      password: hashedPassword,
      // Only allow admin role if explicitly set AND you add your own guard here
      role: role === "admin" ? "admin" : "student",
    });

    res.status(201).json({
      token: generateToken(user._id, user.role),
      user: { id: user._id, username: user.username, role: user.role },
      passwordStrength: classifyStrength(password),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400);
      return next(new Error("Username and password are required."));
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401);
      return next(new Error("Invalid username or password."));
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      return next(new Error("Invalid username or password."));
    }

    res.json({
      token: generateToken(user._id, user.role),
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ id: req.user._id, username: req.user.username, role: req.user.role });
};

module.exports = { register, login, getMe };