const User = require("../../models/user");
const bcrypt = require("bcryptjs");

exports.createUser = async (args) => {
  try {
    let existedUser = await User.findOne({
      email: args.userInput.email,
    });
    if (existedUser) {
      throw new Error("Email already exists.");
    }
    const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    let user = new User({
      email: args.userInput.email,
      password: hashedPassword,
    });
    const res = await user.save();
    return {
      ...res._doc,
      _id: res._doc._id.toString(),
      password: null,
    };
  } catch (error) {
    throw error;
  }
};
