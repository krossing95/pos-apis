import mongoose from "mongoose"

const stockSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  categoryId: String,
  oldQuantity: {
    type: Number,
    required: true,
  },
  quantityAdded: {
    type: Number,
    required: true,
  },
  newQuantity: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
})

const Stock = mongoose.models.Stock || mongoose.model("Stock", stockSchema)

export default Stock
