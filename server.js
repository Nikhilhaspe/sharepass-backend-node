const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

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
