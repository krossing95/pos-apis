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
const model_user_1 = __importDefault(require("../../models/model.user"));
const model_organization_1 = __importDefault(require("../../models/model.organization"));
const model_product_1 = __importDefault(require("../../models/model.product"));
const utils_index_1 = require("../../utils/utils.index");
const helper_index_1 = require("../../helpers/helper.index");
const offsetCalculator = ({ searchString = "", pageNumber = 1, pageSize = 20, sortBy = "createdAt", sortOrder = "desc", organizationId, }) => {
    // Calculate the number of products to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;
    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");
    // Create an initial query object to filter products.
    const query = Object.assign({ organization: organizationId }, utils_index_1.defaultGetActiveProductsQuery);
    // If the search string is not empty, add the $or operator to match either name or genericName fields.
    if (searchString.trim() !== "") {
        query.$or = [
            { name: { $regex: regex } },
            { genericName: { $regex: regex } },
        ];
    }
    // Define the sort options for the fetched products based on createdAt field and provided sort order.
    const sortOptions = { [sortBy]: sortOrder };
    return {
        skipAmount,
        query,
        sortOptions,
        pageSize,
    };
};
const FetchOrganizationalProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        // Find the user and org with the provided email
        const [user, organization] = yield Promise.all([
            model_user_1.default.findOne({ email: payload.email }),
            model_organization_1.default.findOne({ _id: payload.organizationId }),
        ]);
        if (!user || !organization)
            return res.status(412).json({
                message: "User or organization not found",
                code: "412",
                data: {},
            });
        const { skipAmount, sortOptions, pageSize, query } = offsetCalculator(Object.assign({}, payload));
        // Create a query to fetch the products based on the search and sort criteria.
        const productsQuery = model_product_1.default.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);
        // Count the total number of products that match the search criteria (without pagination).
        const totalProductsCount = yield model_product_1.default.countDocuments(query);
        const results = yield productsQuery.exec();
        // Check if there are more products beyond the current page.
        const isNext = totalProductsCount > skipAmount + results.length;
        return res.status(200).json({
            message: "",
            code: "200",
            data: Object.assign({}, (0, helper_index_1.parseApiResults)({ results, isNext })),
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
exports.default = FetchOrganizationalProducts;
