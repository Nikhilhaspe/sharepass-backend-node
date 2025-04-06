const express = require("express");
const morgan = require("morgan");

// routes
const userRoutes = require("./routes/userRoutes");

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

module.exports = app;
