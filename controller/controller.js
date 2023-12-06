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
    res.status(401).json({
      status: "failure",
      error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!(await user.checkPassword(req.body.password, user.password))) {
      return res.status(401).json({
        status: "failure",
        error: "Invalid Email or password",
      });
    }

    res.status(200).json({
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

exports.getAllUser = async (req, res) => {
  try {
    // searching
    /* const users = await User.find({
      "username": { $regex: /bad/, $options: "i" },
    }); */
    // pagination
    const page = req.query["page"] || 1;
    const skip = (page - 1) * 10;
    const limit = 10;

    // sorting
    const sort = req.query["sort"]?.split(",").join(" ") || "-createdAt";

    console.log(sort);

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
      user.save();
    }

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
    console.log(req.body);
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
