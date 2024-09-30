"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const saleSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    organization: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Organization",
    },
    saleItems: {
        type: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
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
});
const Sale = mongoose_1.default.models.Sale || mongoose_1.default.model("Sale", saleSchema);
exports.default = Sale;
