const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

exports.login = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User doesn't exist.");
    }
    const isEqual = await bcrypt.compare(password, user._doc.password);
    if (!isEqual) {
      throw new Error("Password is incorrect. Please try again.");
    }
    const token = await jwt.sign(
      {
        userId: user._doc._id.toString(),
        email: user._doc.email,
      },
      "verysupersecrettoken",
      {
        expiresIn: "1h",
      }
    );
    return {
      userId: user._doc._id.toString(),
      token: token,
      tokenExpiration: 1,
    };
  } catch (error) {
    throw error;
  }
};
