import Token from "../models/token.js";
import Queue from "../models/queue.js";
import { getIO } from "../socket/socket.js";

export const bookToken = async (req, res) => {
  try {
    const { queueId } = req.body;

    if (!queueId) {
      return res.status(400).json({
        message: "Queue ID is required",
      });
    }

    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({
        message: "Queue not found",
      });
    }

    if (!queue.isActive) {
      return res.status(400).json({
        message: "Queue is not active",
      });
    }

    // Today's date range
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Count today's bookings
    const todayBookings = await Token.countDocuments({
      queue: queueId,
      bookedAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
      status: {
        $ne: "cancelled",
      },
    });

    // Check daily limit
    const dailyLimit = queue.dailyLimit || 20;

    if (todayBookings >= dailyLimit) {
      return res.status(400).json({
        message: "Today's appointments are full. Please book tomorrow.",
      });
    }

    const existingToken = await Token.findOne({
      user: req.user.id,
      status: {
        $in: ["waiting", "serving"],
      },
    });

    if (existingToken) {
      return res.status(400).json({
        message: "You already have an active token",
      });
    }

    // Increment token counter
    queue.currentTokenNumber += 1;
    await queue.save();

    // Generate token number
    const tokenNumber = `${queue.prefix}-${String(
      queue.currentTokenNumber
    ).padStart(3, "0")}`;

    // Create token
    const token = await Token.create({
      tokenNumber,
      queue: queue._id,
      user: req.user.id,
    });

    // Emit socket event AFTER creating the token
    const io = getIO();

    io.emit("queueUpdated", {
      queueId: queue._id,
    });

    res.status(201).json({
      message: "Token booked successfully",
      token,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getMyToken = async (req, res) => {
  try {
    // Find the user's active token
    const token = await Token.findOne({
      user: req.user.id,
      status: {
        $in: ["waiting", "serving"],
      },
    }).populate("queue");

    if (!token) {
      return res.status(404).json({
        message: "No active token found",
      });
    }

    // Count people ahead
    const peopleAhead = await Token.countDocuments({
      queue: token.queue._id,
      status: {
        $in: ["waiting", "serving"],
      },
      bookedAt: {
        $lt: token.bookedAt,
      },
    });

    // Calculate estimated waiting time
    const estimatedWait =
      peopleAhead * token.queue.averageServiceTime;

    res.status(200).json({
      token: {
        ...token.toObject(),
        peopleAhead,
        estimatedWait,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


export const serveNextToken = async (req, res) => {
  try {
    const { queueId } = req.body;

    if (!queueId) {
      return res.status(400).json({
        message: "Queue ID is required",
      });
    }

    // Check if queue exists
    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({
        message: "Queue not found",
      });
    }

    // Check if a token is already serving
    const currentServing = await Token.findOne({
      queue: queueId,
      status: "serving",
    });

    // console.log("Queue ID:", queueId);
    // console.log("Current Serving:", currentServing);

    if (currentServing) {
      return res.status(400).json({
        message: "A token is already being served"
      });
    }

    // Find the oldest waiting token
    const nextToken = await Token.findOne({
      queue: queueId,
      status: "waiting",
    }).sort({ bookedAt: 1 });

    if (!nextToken) {
      return res.status(404).json({
        message: "No waiting tokens"
      });
    }

    nextToken.status = "serving";
    nextToken.servedAt = new Date();

    await nextToken.save();

    const io = getIO();

    io.emit("queueUpdated", {
      queueId: queue._id,
    });

    res.status(200).json({
      message: "Token is now serving",
      token: nextToken
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};


export const completeToken = async (req, res) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({
        message: "Token ID is required",
      });
    }

    const token = await Token.findById(tokenId);

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }

    if (token.status !== "serving") {
      return res.status(400).json({
        message: "Only a serving token can be completed",
      });
    }

    token.status = "completed";
    token.completedAt = new Date();

    await token.save();

    const io = getIO();

    io.emit("queueUpdated", {
      queueId: token.queue,
    });

    res.status(200).json({
      message: "Token completed successfully",
      token,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


export const skipToken = async (req, res) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({
        message: "Token ID is required",
      });
    }

    const token = await Token.findById(tokenId);

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }

    if (token.status !== "serving") {
      return res.status(400).json({
        message: "Only a serving token can be skipped",
      });
    }

    token.status = "skipped";
    token.skippedAt = new Date();

    await token.save();

    const io = getIO();

    io.emit("queueUpdated", {
      queueId: token.queue,
    });

    res.status(200).json({
      message: "Token skipped successfully",
      token,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


export const recallToken = async (req, res) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({
        message: "Token ID is required",
      });
    }

    const token = await Token.findById(tokenId);

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }

    if (token.status !== "skipped") {
      return res.status(400).json({
        message: "Only skipped tokens can be recalled",
      });
    }
    token.status = "waiting";

    token.skippedAt = null;

    await token.save();

    const io = getIO();

    io.emit("queueUpdated", {
      queueId: token.queue,
    });

    res.status(200).json({
      message: "Token recalled successfully",
      token,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


export const cancelToken = async (req, res) => {
  try {

    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({
        message: "Token ID is required",
      });
    }

    const token = await Token.findById(tokenId);

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }

    // Only owner can cancel
    if (token.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (token.status !== "waiting") {
      return res.status(400).json({
        message: "Only waiting tokens can be cancelled",
      });
    }

    token.status = "cancelled";
    token.cancelledAt = new Date();

    await token.save();

    const io = getIO();

    io.emit("tokenCancelled", {
      queueId: token.queue,
      tokenNumber: token.tokenNumber,
    });

    res.status(200).json({
      message: "Token cancelled successfully",
      token,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};


export const getQueueTokens = async (req, res) => {
  try {
    const { queueId } = req.params;

    const tokens = await Token.find({
      queue: queueId,
      status: {
        $in: ["waiting", "serving", "skipped","recalled"],
      },
    })
      .populate("user", "name")
      .sort({ bookedAt: 1 });

    res.status(200).json({
      count: tokens.length,
      tokens,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const serveRecalledToken = async (req, res) => {
  try {
    const { queueId } = req.body;

    if (!queueId) {
      return res.status(400).json({
        message: "Queue ID is required",
      });
    }

    // Check if queue exists
    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({
        message: "Queue not found",
      });
    }

    // Check if another token is already being served
    const currentServing = await Token.findOne({
      queue: queueId,
      status: "serving",
    });

    if (currentServing) {
      return res.status(400).json({
        message: "A token is already being served",
      });
    }

    // Find the oldest recalled token
    const recalledToken = await Token.findOne({
      queue: queueId,
      status: "recalled",
    }).sort({ bookedAt: 1 });

    if (!recalledToken) {
      return res.status(404).json({
        message: "No recalled tokens",
      });
    }

    recalledToken.status = "serving";
    recalledToken.servedAt = new Date();

    await recalledToken.save();

    const io = getIO();

    io.emit("queueUpdated", {
      queueId: queue._id,
    });

    res.status(200).json({
      message: "Recalled token is now serving",
      token: recalledToken,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const adminCancelToken = async (req, res) => {

  try {

    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({
        message: "Token ID is required",
      });
    }

    const token = await Token.findById(tokenId);

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }

    if (
      token.status !== "waiting" &&
      token.status !== "recalled"
    ) {
      return res.status(400).json({
        message: "Only waiting or recalled tokens can be cancelled",
      });
    }

    token.status = "cancelled";

    await token.save();

    getIO().emit("queueUpdated", {
      queueId: token.queue,
    });

    res.status(200).json({
      message: "Token cancelled successfully",
      token,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};