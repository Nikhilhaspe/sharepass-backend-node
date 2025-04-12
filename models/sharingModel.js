const mongoose = require("mongoose");
const AppError = require("../utils/apiError");

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

// indexes
// to allow uniqueness for each record
shareSchema.index(
  { credentialId: 1, sharedWith: 1, sharedBy: 1 },
  { unique: true }
);

// pre middlewares
// 1. add shared at property
shareSchema.pre("save", function (next) {
  if (!this.isNew) return next();

  this.sharedAt = Date.now() - 1000;

  next();
});

// 2. check if user is trying to share it with himself
shareSchema.pre("save", function (next) {
  if (this.sharedBy.equals(this.sharedWith)) {
    return next(
      new AppError(
        400,
        "You cannot share credential with yourself!, as you own them"
      )
    );
  }

  next();
});

// 3. populate references
shareSchema.pre(/^find/, function (next) {
  this.populate({
    path: "sharedBy",
    select: "username email",
  })
    .populate({
      path: "sharedWith",
      select: "username email",
    })
    .populate({
      path: "credentialId",
      select: "username password title note tags",
    });

  next();
});

// post middlewares

// static methods

module.exports = mongoose.model("Share", shareSchema);
