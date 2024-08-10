"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Organization",
    },
    // this is the user who created the thread
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
});
const Product = mongoose_1.default.models.Product || mongoose_1.default.model("Product", productSchema);
exports.default = Product;
