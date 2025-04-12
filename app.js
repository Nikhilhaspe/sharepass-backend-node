const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

// routes
const userRoutes = require("./routes/userRoutes");
const credentialRoutes = require("./routes/credentialRoutes");
const sharingRoutes = require("./routes/sharingRoutes");

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
// 3. URL encoded body parser
// app.use(express.urlencoded({ extended: true }));
// 4. Cookie Parser
app.use(cookieParser());
// 5. server static files
app.use(express.static(path.join(__dirname, "public")));

// routes
// 1. users
app.use("/api/v1/users", userRoutes);
// 2. credentials
app.use("/api/v1/credentials", credentialRoutes);
// 3. share
app.use("/api/v1/shares", sharingRoutes);

// Handle All Unmatched Routes
app.use((req, res, next) => {
  return next(
    new AppError(404, `Can't find ${req.originalUrl} on this server!`)
  );
});

// global error handling
app.use(globalErrorController);

module.exports = app;
