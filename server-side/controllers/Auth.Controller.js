const authRouter = require("express").Router();
const db = require("../services/db.Service");
const passport = require("passport");
const Jwt = require("jsonwebtoken");
const authorize = require("../middleware/Authorize.Middleware");
const fs = require('fs');

const { updateAvatar } = require('../middleware/multer');

const { User, Avatar } = db;


const signToken = (userId) => {
  return Jwt.sign(
    {
      issue: "rentalZ.application",
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
  (req, res) => {
    res.status(200).json({ user: req.user });
  },
);

authRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, avatar } = req.user;
      const token = signToken(_id);
      res.status(200).json({
        token,
        message: "Login Successfully",
        mesError: false,
        user: await User.findById(_id).populate('avatar', 'imageUrl'),
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
  console.log(req.body);
  if (!checkExisted) {
    const avatar = await new Avatar();
    const newUser = await new User({
      username: username,
      password: password,
      fullName: fullname,
      dateOfBirth: dateOfBirth,
      role: process.env.User,
      avatar: avatar._id
    });
    await newUser.save();
    avatar.userId = newUser._id;
    await avatar.save();
    res.status(201).json({
      message: "Register successfully",
      user: newUser,
      mesError: false,
    });
  } else {
    res.status(400).json({
      message: "Account already existed",
      mesError: true,
    });
  }
});

authRouter.put('/update_avatar', passport.authenticate("jwt", { session: false }), updateAvatar.single('avatar')
  , async (req, res) => {
    try {
      const avatarUrl = '/statics/avatar/' + req.file.filename;
      const avatar = await Avatar.findById(req.user.avatar._id.toString())
      if (avatar.imageUrl === "") {
        avatar.imageUrl = avatarUrl;
        await avatar.save();
      }
      else {
        fs.unlinkSync('.' + avatar.imageUrl);
        avatar.imageUrl = avatarUrl;
        await avatar.save();
      }
      res.status(200).json({
        message: "update avatar successfully",
        updateAvt: avatar.imageUrl,
        mesError: false,
      })
    } catch (error) {
      fs.unlinkSync(process.env.DIR_AVATAR + req.file.filename);
      res.status(200).json({
        message: "update avatar failed",
        mesError: true,
      })
    }
  })

// authRouter.get(
//   "/logout",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => { },
// );

module.exports = authRouter;
