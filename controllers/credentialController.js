const AppError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const Credential = require("../models/credentialModel");

exports.createCredential = catchAsync(async (req, res, next) => {
  const credential = await Credential.create({
    username: req.body.username,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    title: req.body.title,
    note: req.body.note,
    tags: req.body.tags,
    owner: req.user.id,
  });

  res.status(201).json({ status: "success", data: { credential } });
});

exports.getCredential = catchAsync(async (req, res, next) => {
  const credential = await Credential.findById(req.params.id);

  if (!credential) return next(new AppError(404, "No credential found!"));

  res.status(200).json({ status: "success", data: { credential } });
});

exports.updateCredential = catchAsync(async (req, res, next) => {
  const updatedCredential = await Credential.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(200).json({ status: "success", data: { updatedCredential } });
});

exports.deleteCredential = catchAsync(async (req, res, next) => {
  const credential = await Credential.findByIdAndDelete(req.params.id);

  if (!credential) return next(new AppError(404, "No credential found!"));

  res.status(204).json({ status: "success", data: null });
});
