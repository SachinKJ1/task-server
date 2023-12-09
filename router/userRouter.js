const express = require("express");
const auth = require("../controller/controller");

const router = express.Router();

// router.route("/").get("/do", doSomething);

router.post("/signUp", auth.signUp);

router.post("/login", auth.login);

// router.use(auth.protect)

router.get("/getAllUser",auth.protect, auth.getAllUser);

router.get("/getOneUser/:id",auth.protect, auth.getOneUser);

router.post("/createUser",auth.protect, auth.createUser);

router.patch("/updateUser/:id",auth.protect, auth.updateUser);

router.delete("/deleteUser/:id",auth.protect, auth.deleteUser);

module.exports = router;
