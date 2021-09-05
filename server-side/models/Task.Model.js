const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  taskName: String,
  taskDescription: String,
  isDone: Boolean,
  ofUser: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});

module.exports = mongoose.model("Tasks", TaskSchema);
