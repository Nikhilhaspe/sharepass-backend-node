const User = require("../models/userModel");
const AppError = require("../utils/apiError");
const multer = require("multer");
const sharp = require("sharp");

// multer for image uploads
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError(400, "Not an image, Please upload only image files!"),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// image upload - uploadsfile in the memory and puts file obj in req
exports.uploadUserPhoto = upload.single("photo");

// user photo resize
exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

// utils
function filterObj(obj, ...allowedProps) {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedProps.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
}

// delete user (does not delete the used just de-activates him/her)
exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({ status: "success", data: null });
};

// get user

// update user (data + profile photo file update if present)
exports.updateMe = async function (req, res, next) {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        400,
        "This route is not for password updates. Please use /updatePassword"
      )
    );
  }

  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: "success", data: { user: updatedUser } });
};
