const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: false },
    img: { type: String, required: true },
    price: { type: Number, default: 100 },
    inStock: { type: Boolean, default: true },
    category: { type: String, default: "seeds" },
    subcategory: { type: String, default: "summer" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
