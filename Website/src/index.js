const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
const app = express();
const port = 4020;

// convert data into json format
app.use(express.json());
// static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };

  // check if the user already exists in the database
  const existingUser = await collection.findOne({ email: data.email });
  if (existingUser) {
    res.send("User already exits. Please choose a different account.");
  } else {
    // hash the password
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword; // Replace the original password with the hashed one

    const userdata = await collection.insertMany(data);
    console.log(userdata);
  }
});

// Login user
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ email: req.body.email });
    if (!check) {
      res.send("User not found");
    }
    // Compare the hashed password from the database with the plaintext password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (!isPasswordMatch) {
      res.send("wrong Password");
    } else {
      res.render("home");
    }
  } catch {
    res.send("wrong Details");
  }
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}/`);
});
