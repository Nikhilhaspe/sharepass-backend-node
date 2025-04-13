const express = require("express");

const sharingController = require("../controllers/sharingController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.post("/", sharingController.createShare);

router.get("/:id", sharingController.getShare);

router.get("/", sharingController.getAllShares);

router.delete("/", sharingController.revokeShare);

module.exports = router;
