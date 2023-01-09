const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 2500 },
  price: { type: Number, required: true, min: [0, "Price should be a positive value"] },
  number_in_stock: { type: Number, required: true, min: [0, "The number in stock should be a positive value"] },
  category: {type: Schema.Types.ObjectId, ref: "Category"}
});


// Virtual for item's URL
ItemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/item/${this._id}`;
})

// Export model
module.exports = mongoose.model("Item", ItemSchema);