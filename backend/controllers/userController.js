import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const TOKEN_EXPIRES_IN = "24h";

const createToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
};

//Register a User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Email ID" });
  }
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long",
    });
  }

  try {
    if (await User.findOne({ email })) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error checking for existing user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Login a User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Both fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error occurred while logging in user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Get User Login Details
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error occurred while fetching user details:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Update User Profile Details
export const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Both fields are required" });
  }
  try {
    const exixts = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (exixts) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true, select: "name email" },
    );
    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error occurred while fetching user details:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Change User Password
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res
      .status(400)
      .json({ success: false, message: "Password invalid or too short" });
  }

  try {
    const user = await User.findById(req.user.id).select("password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error occurred while changing password:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
