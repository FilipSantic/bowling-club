const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const userModel = new User();

  if (!username || !password) {
    res.status(400);
    throw new Error("Some of the fields are missing");
  }

  const userExists = await userModel.findOne(username);

  if (userExists) {
    res.status(400);
    throw new Error("Username already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userId = await userModel.create(username, hashedPassword);

  if (userId) {
    res.status(201).json({
      _id: userId,
      username: username,
      password: hashedPassword,
      token: generateToken(userId),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const userModel = new User();

  const user = await userModel.findOne(username);

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      password: user.password,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
};
