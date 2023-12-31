const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 4,
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
    default: "admin",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

/* userSchema.pre(/find/g, async function (next) {
  this.find({ role: { $ne: "admin" } });
  next();
}); */

userSchema.methods.checkPassword = async function (
  docPassword,
  clientPassword
) {
  return await bcrypt.compare(docPassword, clientPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
