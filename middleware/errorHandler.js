// server/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
};

module.exports = errorHandler;