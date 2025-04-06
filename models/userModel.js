const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Pleas tell us your name!"],
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
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// pre middlewares
userSchema.pre("save", async function (next) {
  // will be hit for the new user signup as well
  if (!this.isModified("password")) return next();

  // not storing passwordConfirm field
  this.passwordConfirm = undefined;

  // encrypt the password before storing to the db
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// static methods
userSchema.methods.isPasswordCorrect = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
