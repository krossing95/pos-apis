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
const mongoose_1 = __importDefault(require("mongoose"));
const model_sale_1 = __importDefault(require("../../models/model.sale"));
const model_sale_item_1 = __importDefault(require("../../models/model.sale-item"));
const helper_index_1 = require("../../helpers/helper.index");
const CreateSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const payload = req.body;
        // Create the sale
        const sale = new model_sale_1.default(Object.assign(Object.assign({}, payload.saleData), { saleItems: [] }));
        yield sale.save({ session });
        // Create the sale items and associate them with the sale
        const saleItems = yield Promise.all(payload.saleItemsData.map((itemData) => __awaiter(void 0, void 0, void 0, function* () {
            const saleItem = new model_sale_item_1.default(Object.assign(Object.assign({}, itemData), { parentSaleId: sale._id }));
            yield saleItem.save({ session });
            return saleItem._id;
        })));
        // Update the sale with the created sale items
        sale.saleItems = saleItems;
        yield sale.save({ session });
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        return res.status(201).json({
            message: "Sale created successfully",
            code: "201",
            data: Object.assign({}, (0, helper_index_1.parseApiResults)(sale)),
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            message: "Whoops! Something went wrong",
            code: "500",
            data: {},
        });
    }
});
exports.default = CreateSale;
