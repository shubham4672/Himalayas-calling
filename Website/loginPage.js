const fs = require("node:fs");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 4020;

// importing user for user.js
const User = require("./model/loginuser");

// creating middleware
app.use(express.urlencoded({ extended: true }));

// connecting with the database
mongoose
  .connect("mongodb://127.0.0.1:27017/LoginDataDB")
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
    console.log("Database Can't Be Connected");
  });

app.post("/", async (req, res) => {
  const userData = new User(req.body);
  await userData.save();
  let a = fs.readFileSync("logined.html");
  res.send(a.toString());
});

app.get("/", (req, res) => {
  let a = fs.readFileSync("login.html");
  res.send(a.toString());
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}/`);
});
