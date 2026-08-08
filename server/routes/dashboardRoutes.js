import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import {
  getDashboardStats,
  getCurrentQueue,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/stats",
  verifyToken,
  verifyAdmin,
  getDashboardStats
);

router.get(
  "/current-queue/:queueId",
  verifyToken,
  verifyAdmin,
  getCurrentQueue
);

export default router;