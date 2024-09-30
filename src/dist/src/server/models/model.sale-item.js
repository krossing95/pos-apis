"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const saleItemSchema = new mongoose_1.default.Schema({
    parentSaleId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    organizationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
});
const SaleItem = mongoose_1.default.models.SaleItem || mongoose_1.default.model("SaleItem", saleItemSchema);
exports.default = SaleItem;
