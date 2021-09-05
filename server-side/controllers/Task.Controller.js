const taskRouter = require("express").Router();
const db = require("../services/db.Service");
const passport = require("passport");
const authorize = require("../middleware/Authorize.Middleware");

const Task = db.Tasks;

taskRouter.use(passport.authenticate("jwt", { session: false }));

taskRouter.get("/", authorize.isAdmin, async (req, res) => {
  const { _id } = req.user;
  const listTask = await Task.find({ ofUser: _id });
  res.status(200).json({
    message: "find tasks successfully",
    mesError: false,
    data: listTask,
  });
});
taskRouter.get("/:id", async (req, res) => {});
taskRouter.post("/create", async (req, res) => {});
taskRouter.put("/edit", async (req, res) => {});
taskRouter.delete("/remove", async (req, res) => {});

module.exports = taskRouter;
