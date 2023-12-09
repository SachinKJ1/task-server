const { request } = require("http");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
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
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(201).json({
      status: "success",
      user,
      token,
    });
  } catch (error) {
    res.status(401).json({
      status: "failure",
      error,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res
        .status(401)
        .json({ status: "failure", error: "You must be logged in" });

    const token = req.headers.authorization.split(" ")[1];
    
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded)
    const user = await User.findById(decoded.id);

    if (!user)
      return res
        .status(401)
        .json({ status: "failure", error: "User Doesnot Exist" });

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ status: "failure", error: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user)
      return res.status(401).json({
        status: "failure",
        error: "Invalid Email or password",
      });

    if (user.role !== "admin")
      return res.status(403).json({
        status: "failure",
        error: "You are not authorized to access this page",
      });

    if (!(await user.checkPassword(req.body.password, user.password))) {
      return res.status(401).json({
        status: "failure",
        error: "Invalid Email or password",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.status(200).json({
      status: "success",
      user,
      token,
    });
  } catch (error) {
    res.status(401).json({
      status: "failure",
      error,
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    // searching
    /* const users = await User.find({
      "username": { $regex: /bad/, $options: "i" },
    }); */

    // filtering out admins from the result
    req.query["role"] = { $ne: "admin" };

    // pagination
    const page = req.query["page"] || 1;
    const skip = (page - 1) * 10;
    const limit = 10;

    // sorting
    const sort = req.query["sort"]?.split(",").join(" ") || "-createdAt";

    // console.log(sort);

    delete req.query["page"];
    delete req.query["sort"];
    // {username: "badusha", page : 1}

    const users = await User.find(req.query).sort(sort).skip(skip).limit(limit);
    const count = await User.countDocuments(req.query);

    res.status(200).json({
      status: "success",
      users,
      count,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: "failure",
      error,
    });
  }
};

exports.getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(401).json({
      status: "failure",
      error,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let user;
    if (!req.body.newPassword)
      user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

    if (
      req.body.newPassword &&
      req.body.curPassword &&
      req.body.newPasswordConfirm
    ) {
      user = await User.findById(req.params.id);

      if (!(await user.checkPassword(req.body.curPassword, user.password)))
        return res.status(401).json({
          status: "failure",
          error: "Incorrect password",
        });

      user.password = req.body.newPassword;
      user.email = req.body.email;
      user.role = req.body.role;
      user.username = req.body.username;
      user.save();
    }

    delete user.password;

    res.status(201).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(401).json({
      status: "failure",
      error,
    });
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
    res.status(401).json({
      status: "failure",
      error,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    // can only add users
    // req.body["role"] = "user";
    // console.log(req.body);
    const user = await User.create(req.body);
    res.status(201).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(401).json({
      status: "failure",
      error,
    });
  }
};
