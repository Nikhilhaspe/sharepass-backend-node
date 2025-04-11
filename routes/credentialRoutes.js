const express = require("express");

const credentialController = require("../controllers/credentialController");
const authController = require("../controllers/authController");

const router = express.Router();

// protect all routes
router.use(authController.protect);

router.post("/", credentialController.createCredential);

router.get("/myCredentials", credentialController.getMyCredentials);

router
  .route("/:id")
  .get(credentialController.getCredential)
  .patch(credentialController.updateCredential)
  .delete(credentialController.deleteCredential);

module.exports = router;
