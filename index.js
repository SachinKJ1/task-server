const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");
const userRouter = require("./router/userRouter");

dotenv.config({ path: "./.env" });

mongoose.connect(process.env.DATABASE).then(() => {
  console.log("Db connection successfully established");
});

const app = express();

app.use(cors());
app.use(express.json());
const port = 4000;
// const controller = require("./controller/controller");

app.use("/authenticate", userRouter);

// app.get("/do", controller.doSomething);

const server = app.listen(port, "127.0.0.1", () => {
  console.log("Server listening on port", port);
});

/* app.get("/get",  async (req, res) => {
  try {
    const data = await axios.get("https://jsonplaceholder.typicode.com/users");
    console.log(data)
    
    res.send("Welcome");
  } catch (error) {
    res.send("Welcome - Error");
  }
});

app.post("/post", (req, res) => {
  try {
    console.log("Welcome");
    console.log(req.body);
    res.status(200).json({ status: "Success" });
  } catch (error) {
    res.status(401).json({ error: error });
  }
});

app.patch("/patch", (req, res) => {
  try {
    console.log("Welcome");
    console.log(req.body);
    res.status(200).json({ status: "Success" });
  } catch (error) {
    res.status(401).json({ error: error });
  }
});

app.delete("/delete", (req, res) => {
  try {
    res.send("delete");
  } catch (error) {
    res.send("delete - Error");
  }
});

app.get("/get-header", (req, res) => {
  try {
    console.log(req.headers.authorization);
    res.send("header");
  } catch (error) {
    res.send("header - Error");
  }
});


app.post("/post-header", (req, res) => {
  try {
    console.log(req.headers);
    res.send("header");
  } catch (error) {
    res.send("header - Error");
  }
}); */
