const mongoose = require('mongoose');


const LocationSchema = mongoose.Schema({
    address: String,
    geocode: String,
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }
}, {
    collection: 'locations'
});

module.exports = mongoose.model('Location', LocationSchema)