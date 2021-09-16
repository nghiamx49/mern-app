const mongoose = require("mongoose");

const PropertySchema = mongoose.Schema({
  propertyType: String,
  bedRoom: String,
  addingDate: Date,
  monthlyRentPrice: Number,
  furnitureType: String,
  notes: String,
  reporterName: String,
  description: String,
}, {
  collection: 'properties'
});

module.exports = mongoose.model("Property", PropertySchema);
