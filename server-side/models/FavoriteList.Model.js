const mongoose = require("mongoose");

const FavoriteListSchema = mongoose.Schema(
  {
    userId: String,
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  },
  {
    collection: "favorite_lists",
  }
);

module.exports = mongoose.model("FavoriteList", FavoriteListSchema);
