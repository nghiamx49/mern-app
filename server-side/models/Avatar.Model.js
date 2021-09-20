const mongoose = require("mongoose");

const PropertyImageSchema = mongoose.Schema({
    imageUrl: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    collection: 'avatar_images'
})

module.exports = mongoose.model('Avatar', PropertyImageSchema);