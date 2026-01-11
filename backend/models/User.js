import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  phone: String,
  password: String,

  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active",
  },

  lastLoginAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
