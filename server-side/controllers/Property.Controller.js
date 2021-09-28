const taskRouter = require("express").Router();
const db = require("../services/db.Service");
const passport = require("passport");
const authorize = require("../middleware/Authorize.Middleware");
const { uploadProperty } = require("../middleware/multer");
const fs = require("fs");

const { Property, Location, PropertyImage, FavoriteList } = db;

taskRouter.use(passport.authenticate("jwt", { session: false }));

taskRouter.get("/", async (req, res) => {
  if (req.query.address !== undefined) {
    const listTask = await Property.find()
      .populate("listImage", "imageUrl")
      .populate("location")
      .sort({ addingDate: 1 });
    let result = listTask.filter((item) =>
      item.location.address
        .toLowerCase()
        .includes(req.query.address.toLocaleLowerCase())
    );
    res.status(200).json({
      message: "find tasks successfully",
      mesError: false,
      data: result,
    });
  } else {
    const listTask = await Property.find(
      req?.query?.propertyType?.length > 0
        ? {
            propertyType: req.query?.propertyType || "",
          }
        : {}
    )
      .populate("listImage", "imageUrl")
      .populate("location");
    res.status(200).json({
      message: "find tasks successfully",
      mesError: false,
      data: listTask,
    });
  }
});

taskRouter.get("/item/:id", async (req, res) => {
  const task = await Property.findById(req.params.id)
    .populate("listImage", "imageUrl")
    .populate("location");
  res.status(200).json({
    message: "find task successfully",
    mesError: false,
    data: task,
  });
});

taskRouter.get("/favorite", authorize.isUser, async (req, res) => {
  try {
    const favoriteList = await FavoriteList.find({
      userId: req.user._id,
    });
    const listResponse = favoriteList.map(async ({ itemId }) => {
      let item = await Property.findById(itemId)
        .populate("listImage", "imageUrl")
        .populate("location");
      return item;
    });

    let responseList = await Promise.all(listResponse);

    res.status(200).json({
      data: responseList,
      message: "All properties in favorite list",
    });
  } catch (error) {
    console.log(error.message);
  }
});

taskRouter.post("/favorite/add", authorize.isUser, async (req, res) => {
  const { itemId } = req.body;
  const checkExisted = await FavoriteList.findOne({ itemId: itemId });
  if (checkExisted) {
    res
      .status(400)
      .json({
        message: "This property already in your favorite lists",
        status: 400,
      })
      .end();
  } else {
    const item = await Property.findById(itemId);
    const newItem = await new FavoriteList({
      userId: req.user._id,
      itemId: item._id,
    });
    await newItem.save();
    res
      .status(201)
      .json({ message: "Property added successfully", status: 201 })
      .end();
  }
});

taskRouter.delete("/favorite/:itemId", authorize.isUser, async (req, res) => {
  const { itemId } = req.params;
  await FavoriteList.findOneAndDelete({ itemId: itemId });
  res
    .status(200)
    .json({ message: "Property removed successfully", status: 200 })
    .end();
});

taskRouter.post("/create", authorize.isAdmin, async (req, res, next) => {
  try {
    const {
      propertyType,
      bedRoom,
      addingDate,
      monthlyRentPrice,
      furnitureType,
      notes,
      reporterName,
      address,
      geocode,
    } = req.body;

    const checkExist = await Location.findOne({ address: address });

    if (checkExist) {
      res
        .status(400)
        .json({ message: "This location is already existed", status: 400 })
        .end();
      return;
    } else {
      const location = await new Location({ address, geocode });

      const newProperty = await new Property({
        propertyType,
        bedRoom,
        addingDate,
        monthlyRentPrice,
        furnitureType,
        notes: notes || "",
        reporterName,
        location: location._id,
        description: "",
      });
      await newProperty.save();
      location.property = newProperty._id;
      await location.save();
      res.status(201).json({
        message: "Create successfully",
        property: newProperty,
        status: 201,
      });
    }
  } catch (error) {
    next(error);
  }
});
taskRouter.put(
  "/append/:id",
  authorize.isAdmin,
  uploadProperty.array("propertyImages", 3),
  async (req, res, next) => {
    try {
      const property = await Property.findById(req.params.id);

      const imageArr = req.files.map(async (item) => {
        const imageItem = await new PropertyImage({
          imageUrl: process.env.DIR_PROPERTIES + item.filename,
          property: property._id,
        });
        await imageItem.save();
        return imageItem;
      });

      const listImage = await Promise.all(imageArr);
      property.listImage = listImage;
      await property.save();
      res.status(200).json({ message: "Update successfully", status: 200 });
    } catch (error) {
      req.files.map((item) => {
        fs.unlinkSync(process.env.DIR_PROPERTIES + item.filename);
      });
      next(error);
    }
  }
);

taskRouter.put("/edit/:id", authorize.isAdmin, async (req, res) => {
  const { bedRoom, monthlyRentPrice, furnitureType, notes } = req.body;
  await Property.findByIdAndUpdate(req.params.id, {
    bedRoom: bedRoom,
    monthlyRentPrice: monthlyRentPrice,
    furnitureType: furnitureType,
    notes: notes,
  });
  res.json({ message: "Update successfully", status: 200 });
});

taskRouter.put("/description/:id", authorize.isAdmin, async (req, res) => {
  const { description } = req.body;
  await Property.findByIdAndUpdate(req.params.id, { description });
  res.json({ message: "Update description successfully", status: 200 });
});

taskRouter.delete("/remove/:id", authorize.isAdmin, async (req, res) => {
  await Location.deleteMany({ property: req.params.id });
  const removeImage = await PropertyImage.find({ property: req.params.id });
  removeImage.map((item) => {
    fs.unlinkSync(item.imageUrl);
  });
  await PropertyImage.deleteMany({ property: req.params.id });
  await FavoriteList.deleteMany({ itemId: req.params.id });
  await Property.deleteOne({ _id: req.params.id });
  res.json({ message: "Delete successfully", status: 200 });
});

module.exports = taskRouter;
