const authRouter = require("express").Router();
const db = require("../services/db.Service");
const passport = require("passport");
const Jwt = require("jsonwebtoken");
const authorize = require("../middleware/Authorize.Middleware");
const fs = require('fs');

const { updateAvatar } = require('../middleware/multer');

const User = db.User;


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
    res.status(200).json({ data: req.user });
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

authRouter.post("/register", updateAvatar.single('avatar'), async (req, res) => {
  const { username, password, fullname, dateOfBirth } = req.body;
  const checkExisted = await User.findOne({ username });
  console.log(req.file.filename);
  const url = req.protocol + '://' + req.get('host');
  if (!checkExisted) {
    const newUser = await new User({
      username,
      password,
      fullname,
      dateOfBirth,
      role: process.env.User,
      avatar: url + "/statics/avatar/" + req.file.filename
    });
    await newUser.save();
    res.status(201).json({
      message: "Register successfully",
      user: newUser,
      mesError: false,
    });
  } else {
    fs.unlinkSync(process.env.DIR_AVATAR + req.file.filename);
    res.status(400).json({
      message: "Account already existed",
      mesError: true,
    });
  }
});

// authRouter.get(
//   "/logout",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => { },
// );

module.exports = authRouter;
