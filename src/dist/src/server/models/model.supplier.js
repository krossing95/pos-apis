"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const supplierSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
    description: String,
    address: {
        type: String,
    },
    products: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
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
const Supplier = mongoose_1.default.models.Supplier || mongoose_1.default.model("Supplier", supplierSchema);
exports.default = Supplier;
