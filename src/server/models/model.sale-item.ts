import mongoose from "mongoose"

const saleItemSchema = new mongoose.Schema({
  parentSaleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sale",
  },
  name: {
    type: String,
    required: true,
  },
  saleItemNumber: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
})

const SaleItem =
  mongoose.models.SaleItem || mongoose.model("SaleItem", saleItemSchema)

export default SaleItem
