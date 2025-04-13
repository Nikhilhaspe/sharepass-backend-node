const Share = require("../models/sharingModel");

const AppError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

// add share in batches
exports.createShare = catchAsync(async (req, res, next) => {
  const shares = req.body.sharedWith.map((sharedWith) => {
    return {
      credentialId: req.body.credentialId,
      sharedBy: req.user.id,
      sharedWith,
    };
  });

  const docs = await Share.create(shares);

  if (docs.length !== req.body.sharedWith.length)
    return next(new AppError(500, "Something went wrong, try again!"));

  res
    .status(201)
    .json({ status: "success", records: docs.length, data: { shares: docs } });
});

// get particular share details
exports.getShare = catchAsync(async (req, res, next) => {
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
exports.getAllShares = catchAsync(async (req, res, next) => {
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

// revoke share in batches
exports.revokeShare = catchAsync(async (req, res, next) => {
  const result = await Share.deleteMany({
    credentialId: req.body.credentialId,
    sharedBy: req.user.id,
    sharedWith: { $in: req.body.revokeFrom },
  });

  if (result.deletedCount !== req.body.revokeFrom.length)
    return next(new AppError(500, "Something went wrong, try again!"));

  res.status(200).json({
    status: "success",
    data: {
      data: result,
    },
  });
});
