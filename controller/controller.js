const User = require("../models/userSchema");

/* exports.doSomething = async (req, res) => {
  try {
    const user = await User.create({
      name: "John",
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(403).send("Error");
  }
}; */

exports.signUp = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(401).json(error);
  }
};
