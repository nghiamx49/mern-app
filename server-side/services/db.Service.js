const mongoose = require("mongoose");
const db = {};

const user = require("../models/User.Model");
const property = require("../models/Property.Model");
const propertyImg = require('../models/PropertyImage.Model');
const avatar = require('../models/Avatar.Model');
const location = require('../models/Location.Model')

mongoose.Promise = global.Promise;

db.mongoose = mongoose;

db.User = user;
db.Property = property;
db.PropertyImage = propertyImg;
db.Avatar = avatar;
db.Location = location;

const User = db.User;
const Property = db.Property;

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
      newUser = new User({
        username: "mxnghia49",
        password: "mxnghia49",
        role: process.env.ADMIN,
        fullname: "Mai Xuan Nghia",
        dateOfBirth: Date.now(),
      });
      await newUser.save();
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = db;
