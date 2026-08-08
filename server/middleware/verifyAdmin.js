const verifyAdmin = (req, res, next) => {
  try {
    // Check user's role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export default verifyAdmin;