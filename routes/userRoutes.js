const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);

// protect all below routes
router.use(authController.protect);
router.post("/updatePassword", authController.updatePassowrd);

module.exports = router;
