import mongoose from "mongoose"

const saleSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
  },
  inoviceNumber: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  cashTendered: {
    type: Number,
  },
  customerName: {
    type: String,
  },
  customerPhoneNumber: {
    type: String,
  },
  note: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  saleItems: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SaleItem",
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
  },
  status: {
    type: String,
    default: "unpaid",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
})

const Sale = mongoose.models.Sale || mongoose.model("Sale", saleSchema)

export default Sale
