import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: String,
      required: true,
    },

    queue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "waiting",
        "serving",
        "completed",
        "cancelled",
        "skipped",
      ],
      default: "waiting",
    },

    bookedAt: {
      type: Date,
      default: Date.now,
    },

    servedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    skippedAt: {
      type: Date,
      default: null
    },

    cancelledAt: {
      type: Date,
      default: null
    },
    
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model("Token", tokenSchema);

export default Token;