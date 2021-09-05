const mongoose = require("mongoose");
const db = {};

const users = require("../models/User.Model");
const tasks = require("../models/Task.Model");

mongoose.Promise = global.Promise;

db.mongoose = mongoose;

db.Users = users;
db.Tasks = tasks;

const User = db.Users;
const Task = db.Tasks;

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
        dateofBirth: Date.now(),
      });
      await newUser.save();
    }
    let countTask = await Task.estimatedDocumentCount();
    if (countTask === 0) {
      let newTask = new Task({
        taskName: "Go to sleep",
        taskDescription: "Gtoo sleep go to sleep....",
        isDone: false,
        ofUser: newUser,
      });
      await newTask.save();
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = db;
