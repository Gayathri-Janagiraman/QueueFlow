import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  bookToken,
  getMyToken,
  serveNextToken,
  serveRecalledToken,
  completeToken,
  skipToken,
  recallToken,
  cancelToken,
  getQueueTokens,
  adminCancelToken,
} from "../controllers/tokenController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// User Routes
router.post("/book", verifyToken, bookToken);
router.get("/my-token", verifyToken, getMyToken);

// Admin Routes
router.patch(
  "/serve-next",
  verifyToken,
  verifyAdmin,
  serveNextToken
);

router.patch(
  "/complete",
  verifyToken,
  verifyAdmin,
  completeToken
);

router.patch(
  "/skip",
  verifyToken,
  verifyAdmin,
  skipToken
);

router.patch(
  "/recall",
  verifyToken,
  verifyAdmin,
  recallToken
);

router.patch(
  "/cancel",
  verifyToken,
  cancelToken
);

router.get(
  "/queue/:queueId",
  verifyToken,
  verifyAdmin,
  getQueueTokens
);

router.patch(
  "/serve-recalled",
  verifyToken,
  verifyAdmin,
  serveRecalledToken
);

router.patch(
  "/cancel-admin",
  verifyToken,
  verifyAdmin,
  adminCancelToken
);

export default router;