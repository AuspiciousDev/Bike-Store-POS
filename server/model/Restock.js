const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    restockBy: {
      type: String,
      required: true,
    },
    productID: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    deliveryDate: {
      type: String,
      required: true,
    },
    supplier: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Restock", schema);
