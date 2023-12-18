const express = require("express");
const testController = require("../controller/testController");
const { protect, restrictTo } = require("../controller/authController");

const router = express.Router();

router
  .route("/user")
  .post(protect, testController.createTest)
  .get(protect, testController.getUserTests);

router.route("/user/:testId").patch(protect, testController.updateTest);

router
  .route("/admin")
  .get(protect, restrictTo("admin"), testController.getAllTests);

router
  .route("/admin/:testId")
  .get(testController.getSingleTest)
  .patch(protect, restrictTo("admin"), testController.updateTestStatus);
module.exports = router;
