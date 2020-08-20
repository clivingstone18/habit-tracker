const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const session = require("express-session");

const User = require("./models/user.model");

require("dotenv").config();

var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const app = express();
const port = process.env.PORT || 5000;
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log("app is running");
app.use(express.json());

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

// Routes
const habitsRouter = require("./routes/habits");
const usersRouter = require("./routes/users");

app.use("/habits", habitsRouter);
app.use("/users", usersRouter);

// Routes
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send({
          status: "Successfully Authenticated",
          user: req.user,
        });
      });
    }
  })(req, res, next);
});

app.post("/register", (req, res) => {
  User.find(
    { $or: [{ email: req.body.email }, { username: req.body.username }] },

    async (err, doc) => {
      if (err) throw err;
      if (doc.length !== 0) {
        res.send("User Already Exists");
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
        });
        console.log(newUser);
        await newUser.save();
        res.send({
          status: "Successful Registration",
          user: newUser,
        });
        User.findOne({ username: req.body.username }, async (err, doc) => {
          if (err) throw err;
          if (doc) {
            console.log(doc);
          }
        });
      }
    }
  );
});

app.get("/logout", (req, res) => {
  req.logout();
  res.send(req.user);
});

//checks

app.get("/user", (req, res) => {
  if (req.user) {
    res.send({
      status: "Logged In",
      user: req.user,
    });
  } else {
    console.log("No user is registered");
    res.send({
      status: "Logged Out",
      user: null,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
