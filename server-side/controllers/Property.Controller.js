const taskRouter = require("express").Router();
const db = require("../services/db.Service");
const passport = require("passport");
const authorize = require("../middleware/Authorize.Middleware");

const Property = db.Property;

taskRouter.use(passport.authenticate("jwt", { session: false }));

taskRouter.get("/", authorize.isAdmin, async (req, res) => {
  // const listTask = await Property.find();
  // res.status(200).json({
  //   message: "find tasks successfully",
  //   mesError: false,
  //   data: listTask,
  // });
});

taskRouter.get("/:id", async (req, res) => { });

taskRouter.post("/create", authorize.isAdmin, async (req, res) => {
  const { propertyType,
    bedRoom,
    addingDate,
    monthlyRentPrice,
    furnitureType,
    notes,
    reporterName, } = req.body;
  const newProperty = new Property({
    propertyType,
    bedRoom,
    addingDate,
    monthlyRentPrice,
    furnitureType,
    notes,
    reporterName,
    description: "",
    propertyImg: []
  });
  await newProperty.save();
  res.json({ message: "Create success", status: 201 });
});

taskRouter.put("/edit", async (req, res) => { });

taskRouter.delete("/remove", async (req, res) => { });

module.exports = taskRouter;
