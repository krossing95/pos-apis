import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  genericName: {
    type: String,
  },
  description: {
    type: String,
  },
  productCode: {
    type: String,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  // this is the user who created the thread
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  costPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  onHandQuantity: {
    type: Number,
    default: 0,
  },
  quantitySold: {
    type: Number,
    default: 0,
  },
  categoryId: {
    type: String,
  },
  supplierId: {
    type: String,
  },
  dateOfArrival: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "active",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
})

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema)

export default Product
