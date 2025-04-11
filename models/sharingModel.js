const mongoose = require("mongoose");

const shareSchema = mongoose.Schema({
  credentialId: {
    type: mongoose.Schema.ObjectId,
    ref: "Credential",
    required: [true, "Please add credential ID!"],
  },
  sharedWith: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please add user ID!"],
  },
  sharedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please add user ID!"],
  },
  sharedAt: Date,
});

// pre middlewares

// post middlewares

// static methods

module.exports = mongoose.model("Share", shareSchema);
