import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/authController.js";

import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Route
router.get("/profile", verifyToken, getProfile);

// Admin Route
router.get(
  "/admin",
  verifyToken,
  verifyAdmin,
  (req, res) => {
    res.status(200).json({
      message: "Welcome Admin!",
    });
  }
);

export default router;