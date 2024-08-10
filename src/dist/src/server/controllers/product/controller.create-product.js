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
const model_category_1 = __importDefault(require("../../models/model.category"));
const model_product_1 = __importDefault(require("../../models/model.product"));
const model_organization_1 = __importDefault(require("../../models/model.organization"));
const helper_index_1 = require("../../helpers/helper.index");
const CreateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, config_db_1.connectToDB)();
        const payload = req.body;
        // Find the user and category concurrently with the provided unique id
        const [user, category] = yield Promise.all([
            model_user_1.default.findOne({ _id: payload.createdById }),
            model_category_1.default.findOne({ _id: payload.categoryId }),
        ]);
        if (!user || !category)
            return res
                .status(412)
                .json({ message: "User or category not found", code: "412", data: {} });
        // Create a new product instance
        const product = new model_product_1.default({
            name: payload.name,
            description: payload.description,
            image: payload.image,
            organization: payload.organizationId,
            genericName: payload.genericName,
            productCode: payload.productCode,
            createdBy: user._id,
            costPrice: payload.costPrice,
            sellingPrice: payload.sellingPrice,
            quantity: payload.quantity,
            onHandQuantity: payload.quantity,
            category: payload.categoryId,
            supplierId: payload.supplierId,
            dateOfArrival: payload.dateOfArrival,
        });
        // Save the new product instance
        yield product.save();
        //add product to the organization products
        const organization = yield model_organization_1.default.findOne({
            _id: payload.organizationId,
        }).populate("products");
        if (!organization)
            return res
                .status(412)
                .json({ message: "Organization not found", code: "412", data: {} });
        organization.products.push(product);
        yield organization.save();
        return res
            .status(200)
            .json({ message: "", code: "200", data: Object.assign({}, (0, helper_index_1.parseApiResults)(product)) });
    }
    catch (error) {
        return res.status(500).json({
            message: "Whoops! Something went wrong",
            code: "500",
            data: {},
        });
    }
});
exports.default = CreateProduct;
