// importing library
const copyright =
  "Copyright @ 2021 Hariom Gola. All Right Reserved Not to be Used for Making profit";
const express = require("express");
const chalk = require("chalk");
const cookieParser = require("cookie-parser");
const auth = require("./authentication/auth");
const User = require("./model/user");

// connecting to db
require("./db/mongoose");

// Defining const variable
const app = express();
const PORT = process.env.PORT || 3000;

// Creating directory path only for partials
const hbs = require("hbs");
const path = require("path");
const publicDirectoryPath = path.join(__dirname, "../public");
const viewDirectoryPath = path.join(__dirname, "../template/views");
const partialDirectoryPath = path.join(__dirname, "../template/partial");
app.use(express.static(publicDirectoryPath)); // using css and js

// setting up express properties
app.set("view engine", "hbs");
app.set("views", viewDirectoryPath);
hbs.registerPartials(partialDirectoryPath);
app.use(express.json());
app.use(cookieParser());

// Handler
app.get("/", (req, res) => {
  console.log(chalk.yellow(` |>_ Calling Default Handler`));
  res.render("index", {
    page: "Startup Page",
    ApplicationName: "Node.js Authentication API",
    copyright,
  });
});

//   -- login functionality --  //
app.get("/login", (req, res) => {
  console.log(chalk.yellow(` |>_ Calling Login Handler`));
  res.render("login.hbs", {
    page: "Login Page",
    ApplicationName: "Login Page",
    copyright,
  });
});

app.post("/login", async (req, res) => {
  console.log(chalk.yellow(` |>_ Calling _login Handler`));
  let token = req.body.token;
  console.log(chalk.yellow(` |>_  Token from Request ${token}`));
  try {
    // sending cookier and response back
    res.cookie("session-token", token);
    res.status(200).send("success");
  } catch (e) {
    console.log(chalk.red(` |>_ Error in Login Post Handler`, e));
    res.status(500).send({ error: "Internal Server Error" });
  }
});

//   -- logout functionality -- //
app.get("/logout", (req, res) => {
  console.log(chalk.yellow(` |>_ Calling logout Handler`));
  res.clearCookie("session-token");
  res.redirect("/login");
});

//   -- Profile Functionality --  //
app.get("/profile", auth, (req, res) => {
  console.log(chalk.yellow(` |>_ Calling Profile Handler`));
  let user = req.user;
  console.log(user);
  res.render("profile", {
    user,
    copyright,
    ApplicationName: "Dashboard",
  });

  // DB save
  try {
    let _user = new User({
      name: user.name,
      email: user.email,
    });
    let Result = _user.save();
    console.log(chalk.green(` |>_ Save Data into DB Successfull`));
  } catch (e) {
    console.log(chalk.blue(` |>_ Error with saving the Data`));
  }
});

//  -- authentication check -- //
app.get("/private", auth, (req, res) => {
  console.log(chalk.yellow(` |>_ Calling Private Handler`));
  res.status(200).send({
    status: "Authentication Successfull",
  });
});

//  -- Error Handling -- //
app.get("*", (req, res) => {
  console.log(chalk.yellow(` |>_ Calling Express other Handler`));
  res.render("error", {
    error: `Either you aren't cool enough to visit this page or it doesn't exist.....`,
  });
});

//   -- Starting Server --   //
app.listen(PORT, () => {
  console.log(chalk.yellow(` |>_  Server is up and running at port ${PORT}`));
});
