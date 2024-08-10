"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const organizationSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    logo: String,
    description: String,
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    products: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    members: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
const Organization = mongoose_1.default.models.Organization ||
    mongoose_1.default.model("Organization", organizationSchema);
exports.default = Organization;
