const express = require("express");
const morgan = require("morgan");

// routes
const userRoutes = require("./routes/userRoutes");

// global error controller
const globalErrorController = require("./controllers/globalErrorController");
const AppError = require("./utils/apiError");

const app = express();

// middlewares
// 1. logging for dev only
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// 2. JSON body parser
app.use(express.json());

// routes
// 1. users
app.use("/api/v1/users", userRoutes);

// Handle All Unmatched Routes
app.use((req, res, next) => {
  return next(
    new AppError(404, `Can't find ${req.originalUrl} on this server!`)
  );
});

// global error handling
app.use(globalErrorController);

module.exports = app;
