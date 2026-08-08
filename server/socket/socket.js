let io;

export const initializeSocket = (socketIo) => {
  io = socketIo;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};