const mongoose = require("mongoose");

const PropertyImageSchema = mongoose.Schema({
    imageUrl: String,
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }
}, {
    collection: 'images'
})

module.exports = mongoose.model('Image', PropertyImageSchema);