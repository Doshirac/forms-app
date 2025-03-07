const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const surveyRoutes = require("./routes/surveyRoutes");
const likesRoutes = require("./routes/likesRoutes");
const commentRoutes = require("./routes/commentRoutes");
const salesRoutes = require("./routes/salesRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const languageMiddleware = require("./middlewares/languageMiddleware");

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const ORIGIN = process.env.ORIGIN

app.use(cors({
  origin: ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Language'],
  exposedHeaders: ['X-Language']
}));

app.use(express.json());
app.use(languageMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/surveys", authMiddleware, surveyRoutes);
app.use("/api/users", authMiddleware, userRoutes);

app.use("/api/surveys", authMiddleware, commentRoutes);
app.use("/api/surveys", authMiddleware, likesRoutes);

app.use("/api/sales", authMiddleware, salesRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is accessible on port ${PORT}`);
});