const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const languageMiddleware = require("./middlewares/languageMiddleware");

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Language'],
  exposedHeaders: ['X-Language']
}));

app.use(express.json());
app.use(languageMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is accessible on port ${PORT}`);
});