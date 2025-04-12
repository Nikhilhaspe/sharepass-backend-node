const express = require("express");

const sharingController = require("../controllers/sharingController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.post("/", sharingController.shareCredential);

router.get("/:id", sharingController.getSharedCredential);

router.get("/", sharingController.getSharedCredentials);

router.delete("/", sharingController.revokeCredential);

module.exports = router;
