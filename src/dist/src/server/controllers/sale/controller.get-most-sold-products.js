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
const model_organization_1 = __importDefault(require("../../models/model.organization"));
const helper_index_1 = require("../../helpers/helper.index");
const Get10MostSoldProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        (0, config_db_1.connectToDB)();
        const organization = yield model_organization_1.default.findById(payload.organizationId).populate("products");
        if (!organization)
            return res
                .status(412)
                .json({ message: "Organization not found", code: "412", data: {} });
        // Get all products sold by the organization
        const products = organization.products;
        // Sort products by quantity sold in descending order
        products.sort((a, b) => b.quantitySold - a.quantitySold);
        // Get the top 10 most sold products
        const top10MostSoldProducts = products.slice(0, 10);
        return res.status(200).json({
            message: "",
            code: "200",
            data: { products: (0, helper_index_1.parseApiResults)(top10MostSoldProducts) },
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
exports.default = Get10MostSoldProducts;
