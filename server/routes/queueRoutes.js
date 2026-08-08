import express from "express";
import {
  createQueue,
  getAllQueues,
  getLiveQueues
} from "../controllers/queueController.js";

import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// Public Route
router.get("/", getAllQueues);

// Admin Route
router.post("/", verifyToken, verifyAdmin, createQueue);

router.get("/live", getLiveQueues);

export default router;