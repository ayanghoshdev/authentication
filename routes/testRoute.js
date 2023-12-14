const express = require("express");
const testController = require("../controller/testController");
const { protect, restrictTo } = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .post(protect, testController.createTest)
  .get(testController.getAllTests);

router
  .route("/:testId")
  .get(testController.getSingleTest)
  .patch(protect, restrictTo("admin"), testController.updateTest);
module.exports = router;
