import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import roomRoutes from "./routes/rooms";
import taskRoutes from "./routes/tasks";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routen
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/tasks", taskRoutes);

// Fehler-Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
