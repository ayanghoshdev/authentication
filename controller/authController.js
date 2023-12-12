const User = require("../models/userModel");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");

// const jwtSign = (id) => {
//   jwt.sign()
// };

exports.signup = catchAsync(async (req, res, next) => {
  // STEP 2: extract all fields and check all fields are present or not
  const { name, email, password } = req.body;
  if (!(name && email && password))
    return next(new AppError("name, email, password are required", 400));

  // STEP 3: check for existing user
  const existingUser = await User.findOne({ email });

  if (existingUser)
    return next(
      new AppError("You already have an account, try to login!", 400)
    );

  // STEP 4: encrypt the password and create a user
  const encryptedPaass = await bcrypt.hash(password, 12);
  const newUser = User.create({ name, email, password: encryptedPaass });

  // STEP 5: create and send token to the response
});
