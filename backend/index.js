import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import User from "./models/User.js";

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "dev_secret"; // MVP only

// MongoDB (Docker service name)
mongoose.connect("mongodb://mongodb:27017/auth_mvp")
  .then(() => console.log("✅ MongoDB connected"));


// MIDDLEWARE USER AUTH
const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};// MIDDLEWARE USER AUTH


// ME - GET CURRENT USER
app.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select(
    "fullName username email status"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});// ME - GET CURRENT USER



// REGISTER
app.post("/register", async (req, res) => {
  const { fullName, username, email, phone, password } = req.body;

  const exists = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (exists) {
    return res.status(400).json({
      message: "Email or username already exists",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  await User.create({
    fullName,
    username,
    email,
    phone,
    password: hash,
  });

  res.json({ message: "User registered successfully" });
}); // REGISTER

// LOGIN (email OR username)
app.post("/login", async (req, res) => {
  const { login, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: login }, { username: login }]
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.status === "blocked") {
    return res.status(403).json({
      message: "Your account is blocked. Contact admin.",
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = jwt.sign({ id: user._id }, JWT_SECRET);

  res.json({ token });
});// LOGIN


// GET ALL USERS
app.get("/admin/users", async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});// GET ALL USERS

// BLOCK / UNBLOCK USER
app.patch("/admin/users/:id/status", async (req, res) => {
  const { status } = req.body;

  await User.findByIdAndUpdate(req.params.id, { status });
  res.json({ message: "Status updated" });
});// BLOCK / UNBLOCK USER

// DELETE USER
app.delete("/admin/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});// DELETE USER


// EDIT USER PROFILE
// UPDATE user (edit)
app.put("/admin/users/:id", async (req, res) => {
  const { fullName, username, email, phone } = req.body;

  // Check duplicate email or username (exclude current user)
  const exists = await User.findOne({
    _id: { $ne: req.params.id },
    $or: [{ email }, { username }],
  });

  if (exists) {
    return res.status(400).json({
      message: "Email or username already exists",
    });
  }

  await User.findByIdAndUpdate(req.params.id, {
    fullName,
    username,
    email,
    phone,
  });

  res.json({ message: "User updated successfully" });
});//



app.listen(4000, () => {
  console.log("🚀 Backend running on port 4000");
});
