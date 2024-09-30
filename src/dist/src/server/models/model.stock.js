"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const stockSchema = new mongoose_1.default.Schema({
    itemName: {
        type: String,
        required: true,
    },
    itemId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    organization: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Organization",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
const Stock = mongoose_1.default.models.Stock || mongoose_1.default.model("Stock", stockSchema);
exports.default = Stock;
