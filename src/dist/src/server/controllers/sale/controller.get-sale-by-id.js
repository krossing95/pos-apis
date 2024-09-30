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
const helper_index_1 = require("../../helpers/helper.index");
const GetSaleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(payload.saleId))
            return res
                .status(412)
                .json({ message: "Invalid sale id", code: "412", data: {} });
        const sale = yield model_sale_1.default.findById(payload.saleId).populate("saleItems");
        return res.status(200).json({
            message: "Sale deleted",
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
exports.default = GetSaleById;
