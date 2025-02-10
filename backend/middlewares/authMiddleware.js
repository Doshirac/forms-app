const jwt = require("jsonwebtoken");
const pool = require("../models/db");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No authorization header" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, secretKey);

    const { rows } = await pool.query("SELECT * FROM Users WHERE id = $1", [
      decoded.id,
    ]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.status !== "active")
      return res.status(403).json({ message: "Your account is blocked" });

    req.user = user;
    next();
  } catch (error) {
    console.error("authMiddleware error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;