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
const types_sale_1 = require("../../types/types.sale");
const config_db_1 = require("../../config/config.db");
const model_sale_1 = __importDefault(require("../../models/model.sale"));
const model_sale_item_1 = __importDefault(require("../../models/model.sale-item"));
const model_product_1 = __importDefault(require("../../models/model.product"));
const helper_index_1 = require("../../helpers/helper.index");
const PayForSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        (0, config_db_1.connectToDB)();
        const sale = yield model_sale_1.default.findById(payload.saleId);
        if (!sale)
            return res
                .status(412)
                .json({ message: "Sale not found", code: "412", data: {} });
        //reduce quantity of products in stock and increase quantity sold
        const saleItems = sale.saleItems;
        if (saleItems) {
            yield Promise.all(saleItems.map((itemId) => __awaiter(void 0, void 0, void 0, function* () {
                const saleItem = yield model_sale_item_1.default.findById(itemId);
                if (saleItem) {
                    const product = yield model_product_1.default.findById(saleItem.product);
                    if (product) {
                        product.onHandQuantity -= saleItem.quantity;
                        product.quantitySold += saleItem.quantity;
                        yield product.save();
                    }
                }
            })));
        }
        //update the sale with  a paid status and payment method
        sale.status = types_sale_1.SaleStatus.PAID;
        sale.paymentMethod = payload.saleData.paymentMethod;
        sale.paidAt = new Date();
        sale.cashTendered = payload.saleData.cashTendered;
        sale.note = payload.saleData.note;
        sale.customerName = payload.saleData.customerName;
        sale.customerPhone = payload.saleData.customerPhone;
        yield sale.save();
        return res.status(200).json({
            message: "Payment made successfully",
            code: "200",
            data: Object.assign({}, (0, helper_index_1.parseApiResults)(sale)),
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
exports.default = PayForSale;
