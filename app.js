import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);

// Health route for testing
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API Working" });
});

export default app;
