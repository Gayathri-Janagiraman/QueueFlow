import Token from "../models/token.js";
import Queue from "../models/queue.js";

export const getDashboardStats = async (req, res) => {
  try {

    const waiting = await Token.countDocuments({
      status: "waiting",
    });

    const serving = await Token.countDocuments({
      status: "serving",
    });

    const completed = await Token.countDocuments({
      status: "completed",
    });

    const skipped = await Token.countDocuments({
      status: "skipped",
    });

    const cancelled = await Token.countDocuments({
      status: "cancelled",
    });

    const totalVisitors = await Token.countDocuments();

    res.status(200).json({
      totalVisitors,
      waiting,
      serving,
      completed,
      skipped,
      cancelled,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


export const getCurrentQueue = async (req, res) => {
  try {
    const { queueId } = req.params;

    // Check if queue exists
    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({
        message: "Queue not found",
      });
    }

    // Current serving token
    const servingToken = await Token.findOne({
      queue: queueId,
      status: "serving",
    });

    // Next waiting token
    const nextToken = await Token.findOne({
      queue: queueId,
      status: "waiting",
    }).sort({ bookedAt: 1 });

    // Waiting count
    const waitingCount = await Token.countDocuments({
      queue: queueId,
      status: "waiting",
    });

    res.status(200).json({
      queue: queue.name,
      currentlyServing: servingToken
        ? servingToken.tokenNumber
        : null,
      nextToken: nextToken
        ? nextToken.tokenNumber
        : null,
      waitingCount,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};