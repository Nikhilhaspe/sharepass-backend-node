const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/apiError");
const { promisify } = require("util");

// JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

// new user sign up
exports.protect = async (req, res, next) => {
  let token;

  // 1. Check token present or not
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(401, "You are not logged in, please login to get access!")
    );
  }

  // 2. verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. verify user
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(401, "The user belonging to this token does not exists!")
    );
  }

  // 4. check is password changed after token created time
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(401, "User recently changed password! Please login again!")
    );
  }

  // 5. success
  req.user = currentUser;
  next();
};

// signup
exports.signUp = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  return createSendToken(newUser, 201, res);
};

// login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(400, "Invalid email or password!"));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new AppError(401, "Invalid email or password!"));
  }

  return createSendToken(user, 201, res);
};

// password update
exports.updatePassowrd = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // check current password
  if (
    !(await user.isPasswordCorrect(req.body.passwordCurrent, user.password))
  ) {
    return next(new AppError(401, "Your current password is wrong!"));
  }

  // if so, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  // triggers validator for the password validation
  await user.save();

  // new JWT token
  createSendToken(user, 200, res);
};
