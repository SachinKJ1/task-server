const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 6,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "please enter a valid email address",
    },
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    required: true,
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
