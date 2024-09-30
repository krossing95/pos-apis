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
const model_sale_1 = __importDefault(require("../../models/model.sale"));
const config_db_1 = require("../../config/config.db");
const DeleteSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        (0, config_db_1.connectToDB)();
        // find the sale by id and check if it exists
        const saleExists = yield model_sale_1.default.findById(payload.saleId);
        if (!saleExists)
            return res
                .status(412)
                .json({ message: "Sale not found", code: "412", data: {} });
        yield model_sale_1.default.findByIdAndDelete(payload.saleId);
        return res
            .status(200)
            .json({ message: "Sale deleted successfully", code: "200", data: {} });
    }
    catch (error) {
        return res.status(500).json({
            message: "Whoops! Something went wrong",
            code: "500",
            data: {},
        });
    }
});
exports.default = DeleteSale;
