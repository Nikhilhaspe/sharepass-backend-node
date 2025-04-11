process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception 💥");
  console.error(`${err.name} : ${err.message}`);

  // kill the server
  process.exit(1);
});

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// Db Connection
const DB = process.env.DBCONSTR.replace(
  "<DBUSERNAME>",
  process.env.DBUSERNAME
).replace("<DBPASS>", process.env.DBPASS);

mongoose.connect(DB).then((connection) => console.log("Connected To DB ✅"));

// App
const app = require("./app");
const SERVER = app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.port || 3000} ✅`);
});

// ERRORS: outisde express app

// globally catch unhandled rejctions
// handling unhandled rejection
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection 💥");
  console.error(`${err.name}${err.message}`);

  // gracefull shutdown
  SERVER.close(() => {
    console.log("Finishing ongoing requests...");
    console.log("Shutting down...");
    process.exit(1);
  });
});
