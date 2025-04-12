const Share = require("../models/sharingModel");

const AppError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

// add new share
// TODO: Convert this to work with multiple shared withs
exports.shareCredential = handlerFactory.createOne(Share);

// get particular share details
exports.getSharedCredential = catchAsync(async (req, res, next) => {
  const credential = await Share.findOne({
    sharedWith: req.user.id,
    _id: req.params.id,
  });

  if (!credential) return next(new AppError(404, "No record found"));

  res.status(200).json({
    status: "success",
    data: {
      credential,
    },
  });
});

// get all shares
exports.getSharedCredentials = catchAsync(async (req, res, next) => {
  const docs = await Share.find({ sharedWith: { $eq: req.user.id } });

  if (docs.length === 0) return next(new AppError(404, "No records found!"));

  res.status(200).json({
    status: "success",
    records: docs.length,
    data: {
      shares: docs,
    },
  });
});

// TODO: Convert this to work with multiple shared withs
exports.revokeCredential = catchAsync(async (req, res, next) => {
  res
    .status(500)
    .json({ status: "success", message: "Route not defined yet!" });
});
