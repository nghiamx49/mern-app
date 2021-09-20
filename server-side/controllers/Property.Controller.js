const taskRouter = require("express").Router();
const db = require("../services/db.Service");
const passport = require("passport");
const authorize = require("../middleware/Authorize.Middleware");
const { uploadProperty } = require('../middleware/multer');
const fs = require('fs');

const { Property, Location, PropertyImage } = db;

taskRouter.use(passport.authenticate("jwt", { session: false }));

taskRouter.get("/", async (req, res) => {
  console.log(req.query);
  const listTask = await Property.find(req.query?.propertyType && { propertyType: req.query?.propertyType || "" }).populate('listImage', 'imageUrl').populate('location');
  res.status(200).json({
    message: "find tasks successfully",
    mesError: false,
    data: listTask,
  });
});

taskRouter.get("/:id", async (req, res) => {
  const task = await Property.findById(req.params.id).populate('listImage', 'imageUrl').populate('location');
  res.status(200).json({
    message: "find task successfully",
    mesError: false,
    data: task,
  });
});

taskRouter.post("/create", authorize.isAdmin, uploadProperty.array('propertyImages', 3), async (req, res, next) => {
  try {
    const { propertyType,
      bedRoom,
      addingDate,
      monthlyRentPrice,
      furnitureType,
      notes,
      reporterName,
      address, geocode } = req.body;

    const location = await new Location({ address, geocode });

    const newProperty = new Property({
      propertyType,
      bedRoom,
      addingDate,
      monthlyRentPrice,
      furnitureType,
      notes,
      reporterName,
      location: location._id,
      description: "",
    });

    const imageArr = req.files.map(async item => {
      const imageItem = await new PropertyImage({ imageUrl: process.env.DIR_PROPERTIES + item.filename, property: newProperty._id })
      await imageItem.save();
      return imageItem;
    })

    const listImage = await Promise.all(imageArr);
    newProperty.listImage = listImage;
    await newProperty.save();
    location.property = newProperty._id;
    await location.save();
    res.json({ message: "Create successfully", status: 201 });
  } catch (error) {
    req.files.map(item => {
      fs.unlinkSync(process.env.DIR_PROPERTIES + item.filename);
    })
    next(error);
  }
});

taskRouter.put("/edit/:id", authorize.isAdmin, async (req, res) => {
  const { bedRoom,
    monthlyRentPrice,
    furnitureType,
    notes } = req.body;
  await Property.findByIdAndUpdate(req.params.id, { bedRoom: bedRoom, monthlyRentPrice: monthlyRentPrice, furnitureType: furnitureType, notes: notes });
  res.json({ message: "Update successfully", status: 200 });
});

taskRouter.put('/description/:id', authorize.isAdmin, async (req, res) => {
  const { description } = req.body;
  await Property.findByIdAndUpdate(req.params.id, { description });
  res.json({ message: "Update description successfully", status: 200 });

})

taskRouter.delete("/remove/:id", authorize.isAdmin, async (req, res) => {
  await Location.deleteMany({ property: req.params.id });
  const removeImage = await PropertyImage.find({ property: req.params.id });
  removeImage.map(item => {
    fs.unlinkSync(item.imageUrl);
  })
  await PropertyImage.deleteMany({ property: req.params.id });
  await Property.deleteOne({ _id: req.params.id });
  res.json({ message: "Delete successfully", status: 200 });
});

module.exports = taskRouter;