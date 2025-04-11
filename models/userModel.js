const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please tell us your username!"],
    unique: true,
    validate: {
      // only works for create & save
      validator: function (el) {
        return !el.includes(" ") && validator.isAlphanumeric(el);
      },
      message:
        "Username cannot contain any white spaces and only alphanumeric characters are allowed!",
    },
    maxlength: 30,
    minlength: 3,
  },
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please tell us your email!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide valid email!"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, "Please provide a password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!"],
    validate: {
      // Works only for create & save
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// pre middlewares
// search in only active user for every query that starts with find
userSchema.pre(/^find/, function (next) {
  // this => current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre("save", async function (next) {
  // will be hit for the new user signup as well
  if (!this.isModified("password")) return next();

  // not storing passwordConfirm field
  this.passwordConfirm = undefined;

  // encrypt the password before storing to the db
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// static methods
userSchema.methods.isPasswordCorrect = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
