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
const config_db_1 = require("../../config/config.db");
const model_user_1 = __importDefault(require("../../models/model.user"));
const model_product_1 = __importDefault(require("../../models/model.product"));
const model_stock_1 = __importDefault(require("../../models/model.stock"));
const helper_index_1 = require("../../helpers/helper.index");
const AddStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        (0, config_db_1.connectToDB)();
        // Find the user with the provided unique id
        const user = yield model_user_1.default.findOne({ _id: payload.createdBy });
        if (!user)
            return res
                .status(412)
                .json({ message: "User not found", code: "412", data: {} });
        // Find the product with the provided unique id
        const product = yield model_product_1.default.findOne({
            _id: payload.itemId,
        });
        if (!product)
            return res
                .status(412)
                .json({ message: "Product not found", code: "412", data: {} });
        const newStock = new model_stock_1.default({
            organization: payload.organization,
            createdBy: payload.createdBy, // Use the mongoose ID of the user
            itemName: payload.itemName,
            itemId: payload.itemId,
            categoryId: payload.categoryId,
            oldQuantity: payload.oldQuantity,
            quantityAdded: payload.quantityAdded,
            newQuantity: payload.newQuantity,
            createdAt: payload.createdAt,
        });
        const createdStock = yield newStock.save();
        // get the product and update the quantity
        product.quantity = payload.newQuantity;
        yield product.save();
        return res.status(201).json({
            message: "Stock created successfully",
            code: "201",
            data: Object.assign({}, (0, helper_index_1.parseApiResults)(createdStock)),
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Whoops! Something went wrong",
            code: "500",
            data: {},
        });
    }
});
exports.default = AddStock;
