const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const credentialSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add username!"],
    },
    password: {
      type: String,
      required: [true, "Please add password!"],
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password!"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords do not match!",
      },
    },
    title: {
      type: String,
      required: [true, "Please add title!"],
    },
    note: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    // password owner
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please add password owner ID!"],
    },
  },
  {
    timestamps: true,
  }
);

// pre middlewares
credentialSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.passwordConfirm = undefined;
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

credentialSchema.pre(/^find/, function (next) {
  this.populate({
    path: "owner",
    select: "username email",
  });

  next();
});

// post middlewares

// static methods

const Credential = mongoose.model("Credential", credentialSchema);
module.exports = Credential;
