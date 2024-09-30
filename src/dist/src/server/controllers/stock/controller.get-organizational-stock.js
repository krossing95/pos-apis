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
const model_stock_1 = __importDefault(require("../../models/model.stock"));
const helper_index_1 = require("../../helpers/helper.index");
const GetOrganizationalStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        payload.pageNumber = payload.pageNumber || 1;
        payload.pageSize = payload.pageSize || 10;
        payload.searchString = payload.searchString || "";
        payload.searchString = payload.searchString || "desc";
        (0, config_db_1.connectToDB)();
        const organization = yield model_organization_1.default.findOne({
            _id: payload.organizationId,
        });
        if (!organization)
            return res
                .status(412)
                .json({ message: "Organization not found", code: "412", data: {} });
        // Calculate the number of orders to skip based on the page number and page size.
        const skipAmount = (payload.pageNumber - 1) * payload.pageSize;
        // Create a case-insensitive regular expression for the provided search string.
        const regex = new RegExp(payload.searchString, "i");
        // Create an initial query object to filter orders.
        const query = {
            organization: organization._id,
        };
        // If the search string is not empty, add the $or operator to match either name or genericName fields.
        if (payload.searchString.trim() !== "") {
            query.$or = [{ name: { $regex: regex } }];
        }
        // Define the sort options for the fetched orders based on createdAt field and provided sort order.
        const sortOptions = payload.sortBy;
        // Create a query to fetch the orders based on the search and sort criteria.
        const stocksQuery = model_stock_1.default.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(payload.pageSize);
        // Count the total number of orders that match the search criteria (without pagination).
        const totalStocksCount = yield model_stock_1.default.countDocuments(query);
        const results = yield stocksQuery.exec();
        // Check if there are more orders beyond the current page.
        const isNext = totalStocksCount > skipAmount + results.length;
        const totalPages = Math.ceil(totalStocksCount / payload.pageSize);
        return res.status(200).json({
            message: "",
            code: "200",
            data: Object.assign({}, (0, helper_index_1.parseApiResults)({
                results,
                isNext,
                total: totalStocksCount,
                pageSize: payload.pageSize,
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
exports.default = GetOrganizationalStock;
