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
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  listImage: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
}, {
  collection: 'properties'
});


module.exports = mongoose.model("Property", PropertySchema);
