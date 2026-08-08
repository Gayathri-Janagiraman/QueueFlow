import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    averageServiceTime: {
      type: Number,
      required: true,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    prefix: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      unique: true
    },

    currentTokenNumber: {
      type: Number,
      default: 0
    },

    dailyLimit: {
      type: Number,
      required: true,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

const Queue = mongoose.model("Queue", queueSchema);

export default Queue;