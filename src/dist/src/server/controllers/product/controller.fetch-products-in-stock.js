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
const model_organization_1 = __importDefault(require("../../models/model.organization"));
const utils_index_1 = require("../../utils/utils.index");
const model_product_1 = __importDefault(require("../../models/model.product"));
const helper_index_1 = require("../../helpers/helper.index");
const offsetCalculator = ({ organizationId, searchString = "", pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortOrder = "desc", }) => {
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");
    const query = Object.assign({ organization: organizationId, quantity: { $gt: 0 } }, utils_index_1.defaultGetActiveProductsQuery);
    // If the search string is not empty, add the $or operator to match either name or genericName fields.
    if (searchString.trim() !== "") {
        query.$or = [
            { name: { $regex: regex } },
            { genericName: { $regex: regex } },
        ];
    }
    const sortOptions = { [sortBy]: sortOrder };
    return {
        skipAmount,
        query,
        sortOptions,
        pageSize,
    };
};
const FetchProductsInStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        (0, config_db_1.connectToDB)();
        // Find the user with the provided email
        const user = yield model_user_1.default.findOne({ email: payload.email });
        if (!user)
            return res
                .status(412)
                .json({ message: "User not found", code: "412", data: {} });
        // Find the organization with the provided unique id
        const organization = yield model_organization_1.default.findOne({
            _id: payload.organizationId,
        });
        if (!organization)
            return res
                .status(412)
                .json({ message: "Organization not found", code: "412", data: {} });
        const { pageSize, query, skipAmount, sortOptions } = offsetCalculator(Object.assign({}, payload));
        const productsQuery = model_product_1.default.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);
        // Count the total number of products that match the search criteria (without pagination).
        const totalProductsCount = yield model_product_1.default.countDocuments(query);
        const results = yield productsQuery.exec();
        // Check if there are more products beyond the current page.
        const isNext = totalProductsCount > skipAmount + results.length;
        const totalPages = Math.ceil(totalProductsCount / pageSize);
        return res.status(200).json({
            message: "",
            code: "200",
            data: Object.assign({}, (0, helper_index_1.parseApiResults)({
                results,
                isNext,
                total: totalProductsCount,
                pageSize,
                pageNumber: payload.pageNumber,
                totalPages,
            })),
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
exports.default = FetchProductsInStock;
