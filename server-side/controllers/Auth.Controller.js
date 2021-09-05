const authRouter = require("express").Router();
const db = require("../services/db.Service");
const passport = require("passport");
const Jwt = require("jsonwebtoken");
const authorize = require("../middleware/Authorize.Middleware");

const User = db.Users;

const signToken = (userId) => {
  return Jwt.sign(
    {
      issue: "Todo-app",
      subject: userId,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "86400s",
    },
  );
};

authRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorize.isAdmin,
  (req, res) => {
    res.status(200).json({ message: "hello world" });
  },
);

authRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, username, role, fullname } = req.user;
      const token = signToken(_id);
      res.status(200).json({
        message: "Login Successfully",
        mesError: false,
        data: {
          username,
          role,
          fullname,
          token,
        },
      });
    } else {
      res.status(401).json({
        message: "Login Failed",
        mesError: true,
      });
    }
  },
);

authRouter.post("/register", async (req, res) => {
  const { username, password, fullname, dateOfBirth } = req.body;
  const checkExisted = await User.findOne({ username });
  if (!checkExisted) {
    const newUser = await new User({
      username,
      password,
      fullname,
      dateOfBirth,
      role: process.env.User,
    });
    await newUser.save();
    res.status(201).json({
      message: "Register successfully",
      mesError: false,
    });
  } else {
    res.status(400).json({
      message: "Account already existed",
      mesError: true,
    });
  }
});

authRouter.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {},
);

module.exports = authRouter;
