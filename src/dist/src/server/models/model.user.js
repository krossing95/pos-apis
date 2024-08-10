"use strict";
"use server";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Organization",
        },
    ],
    activeOrganization: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
});
const User = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
exports.default = User;
