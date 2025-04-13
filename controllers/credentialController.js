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
  const credential = await Credential.findOne({
    _id: req.params.id,
    owner: req.user.id,
  });

  if (!credential) return next(new AppError(404, "No credential found!"));

  res.status(200).json({ status: "success", data: { credential } });
});

exports.updateCredential = catchAsync(async (req, res, next) => {
  const updatedCredential = await Credential.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );

  if (!updatedCredential)
    return next(new AppError(404, "No credential found!"));

  res.status(200).json({ status: "success", data: { updatedCredential } });
});

exports.deleteCredential = catchAsync(async (req, res, next) => {
  const credential = await Credential.deleteOne({
    _id: req.params.id,
    owner: req.user.id,
  });

  if (!credential) return next(new AppError(404, "No credential found!"));

  res.status(204).json({ status: "success", data: null });
});

exports.getMyCredentials = catchAsync(async (req, res, next) => {
  const credentials = await Credential.find({ owner: req.user.id });

  if (credentials.length === 0)
    return next(new AppError(404, "No credentials found!"));

  res.status(200).json({
    status: "success",
    length: credentials.length,
    data: {
      credentials,
    },
  });
});
