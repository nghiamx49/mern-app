const mongoose = require("mongoose");
const db = {};

const user = require("../models/User.Model");
const property = require("../models/Property.Model");
const propertyImg = require("../models/PropertyImage.Model");
const avatar = require("../models/Avatar.Model");
const location = require("../models/Location.Model");
const favoriteList = require("../models/FavoriteList.Model");

mongoose.Promise = global.Promise;

db.mongoose = mongoose;

db.User = user;
db.Property = property;
db.PropertyImage = propertyImg;
db.Avatar = avatar;
db.Location = location;
db.FavoriteList = favoriteList;

const User = db.User;
const Avatar = db.Avatar;

db.connectToDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connection success");
    db.initialize();
  } catch (error) {
    console.log(error);
  }
};

db.initialize = async () => {
  try {
    let countUser = await User.estimatedDocumentCount();
    let newUser;
    if (countUser === 0) {
      const newAvt = new Avatar();
      newUser = new User({
        username: "mxnghia49",
        password: "mxnghia49",
        role: process.env.ADMIN,
        fullName: "Mai Xuan Nghia",
        dateOfBirth: Date.now(),
        avatar: newAvt._id,
      });
      await newUser.save();
      newAvt.userId = newUser._id;
      await newAvt.save();
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = db;
