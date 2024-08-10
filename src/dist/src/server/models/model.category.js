"use strict";
"use server";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CategorySchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    organization: {
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
const Category = mongoose_1.default.models.Category || mongoose_1.default.model("Category", CategorySchema);
exports.default = Category;
