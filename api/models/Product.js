const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: false },
    img: { type: String, default: "" },
    thumb: { type: String, default: "" },
    preview: { type: String, default: "" },
    price: { type: Number, default: 100 },
    inStock: { type: Boolean, default: true },
    category: { type: String, default: "seeds" },
    subcategory: { type: String, default: "summer" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
