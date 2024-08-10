"use server"
import mongoose from "mongoose"

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  organization: {
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

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema)

export default Category
