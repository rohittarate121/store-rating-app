const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/index");
const {
  validateName,
  validatePassword,
  validateEmail,
} = require("../utils/validate");

require("dotenv").config();

// POST /api/auth/register
async function register(req, res) {
  try {
    const { name, email, password, address } = req.body;

    if (!validateName(name)) {
      return res
        .status(400)
        .json({ message: "Name must be between 20 and 60 characters" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 characters with at least one uppercase letter and one special character",
      });
    }

    if (address && address.length > 400) {
      return res
        .status(400)
        .json({ message: "Address must be under 400 characters" });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: "user",
    });

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// PATCH /api/auth/change-password
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 characters with at least one uppercase letter and one special character",
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashedPassword });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = { register, login, changePassword };
