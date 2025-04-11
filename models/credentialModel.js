const mongoose = require("mongoose");

const credentialSchema = mongoose.Schema({
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
  },
  tags: {
    type: String,
  },
  // password owner
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please add password owner ID!"],
  },
  createdAt: Date,
  updatedAt: Date,
});

// pre middlewares

// post middlewares

// static methods

const Credential = mongoose.model("Credential", credentialSchema);
