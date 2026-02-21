require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const timeout = require("connect-timeout");

const extractRoutes = require("./routes/extract");
const config = require("./config/appConfig");
const errorHandler = require("./middleware/errorHandler");

const app = express();

/* =========================
   SECURITY MIDDLEWARE
========================= */

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Try again later."
  }
});

app.use(limiter);

// ✅ Request Timeout (60 seconds max per request)
app.use(timeout("60s"));

// Prevent further processing if timed out
app.use((req, res, next) => {
  if (!req.timedout) next();
});

/* =========================
   CORE MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json({ limit: "1mb" }));

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api", extractRoutes);

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use(errorHandler);

/* =========================
   SERVER START
========================= */

app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});