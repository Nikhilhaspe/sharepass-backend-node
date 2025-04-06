const User = require("../models/userModel");

// new user sign up
exports.signUp = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  newUser.password = undefined;
  res.status(201).json({ status: "success", data: { user: newUser } });
};

// user login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ status: "fail", message: "Invalid email or password!" });
    return;
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    res
      .status(401)
      .json({ status: "fail", message: "Invalid email or password!" });
    return;
  }

  // user.password = undefined;
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};
