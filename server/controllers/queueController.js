import Queue from "../models/queue.js";
import Token from "../models/token.js";

export const createQueue = async (req, res) => {
  try {
    const {
      name,
      description,
      averageServiceTime,
      prefix,
    } = req.body;

    // Check required fields
    if (!name || !description || !averageServiceTime || !prefix) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Check if queue already exists
    const existingQueue = await Queue.findOne({ name });

    if (existingQueue) {
      return res.status(400).json({
        message: "Queue already exists",
      });
    }

    // Check if prefix already exists
    const existingPrefix = await Queue.findOne({ prefix });

    if (existingPrefix) {
      return res.status(400).json({
        message: "Queue prefix already exists",
      });
    }

    // Create queue
    const queue = await Queue.create({
      name,
      description,
      averageServiceTime,
      prefix,
    });

    res.status(201).json({
      message: "Queue created successfully",
      queue,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getAllQueues = async (req, res) => {
  try {
    const queues = await Queue.find({
      isActive: true,
    }).sort({ name: 1 });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const queuesWithStats = await Promise.all(
      queues.map(async (queue) => {
        const todayBookings = await Token.countDocuments({
          queue: queue._id,
          bookedAt: {
            $gte: startOfToday,
            $lte: endOfToday,
          },
          status: {
            $ne: "cancelled",
          },
        });

        const remainingSlots =
          queue.dailyLimit - todayBookings;

        return {
          ...queue.toObject(),
          todayBookings,
          remainingSlots,
          isFull: remainingSlots <= 0,
        };
      })
    );

    res.status(200).json({
      count: queuesWithStats.length,
      queues: queuesWithStats,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getLiveQueues = async (req, res) => {
  try {
    // Get all active queues
    const queues = await Queue.find({ isActive: true });

    const liveQueues = await Promise.all(
      queues.map(async (queue) => {
        // Current serving token
        const servingToken = await Token.findOne({
          queue: queue._id,
          status: "serving",
        }).sort({ updatedAt: -1 });

        // Count waiting tokens
        const waitingCount = await Token.countDocuments({
          queue: queue._id,
          status: "waiting",
        });

        return {
          queueId: queue._id,
          department: queue.name,
          prefix: queue.prefix,
          servingToken: servingToken
            ? servingToken.tokenNumber
            : null,
          waitingCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      queues: liveQueues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};