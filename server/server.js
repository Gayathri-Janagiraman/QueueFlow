import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import queueRoutes from "./routes/queueRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import http from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket/socket.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/queues", queueRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("QueueFlow API is running...");
});

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PATCH"],
  },
});
initializeSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
