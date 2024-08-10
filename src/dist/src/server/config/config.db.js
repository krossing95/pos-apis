"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let isConnected = false; // Variable to track the connection status
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Set strict query mode for Mongoose to prevent unknown field queries.
    mongoose_1.default.set("strictQuery", true);
    if (!process.env.POS_MONGODB_URL)
        return console.log("Missing MongoDB URL");
    // If the connection is already established, return without creating a new connection.
    if (isConnected) {
        console.log("MongoDB connection already established");
        return;
    }
    try {
        yield mongoose_1.default.connect(process.env.POS_MONGODB_URL);
        isConnected = true; // Set the connection status to true
        console.log("MongoDB connected");
    }
    catch (error) {
        console.log("connection failed", error);
    }
});
exports.connectToDB = connectToDB;
