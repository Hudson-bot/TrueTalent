// backend/controllers/userController.js
import User from '../models/User.js';

// Create a new user
export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users (optional)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get the most recent user (personal info)
export const getLatestUser = async (req, res) => {
  try {
    const latestUser = await User.findOne().sort({ createdAt: -1 });
    if (!latestUser) {
      return res.status(404).json({ message: "No user found" });
    }
    res.json(latestUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
