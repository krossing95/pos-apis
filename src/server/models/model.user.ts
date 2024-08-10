"use server"
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
  },
  user_role: {
    type: String,
    default: "sales_person",
  },
  image: String,
  onboarded: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  organizations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  ],
  activeOrganization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  subscriptionPackage: {
    type: String,
    default: "basic",
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

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User
