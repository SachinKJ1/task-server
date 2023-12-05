const express = require("express");
const auth = require("../controller/controller");

const router = express.Router();

// router.route("/").get("/do", doSomething);

router.post("/signUp", auth.signUp);

router.post("/login", auth.login);

router.get("/getAllUser", auth.getAllUser);

router.get("/getOneUser/:id", auth.getOneUser);

router.post("/createUser", auth.createUser);

router.patch("/updateUser/:id", auth.updateUser);

router.delete("/deleteUser/:id", auth.deleteUser);

module.exports = router;
