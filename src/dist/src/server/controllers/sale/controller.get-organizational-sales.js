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
const model_user_1 = __importDefault(require("../../models/model.user"));
const model_organization_1 = __importDefault(require("../../models/model.organization"));
const model_sale_1 = __importDefault(require("../../models/model.sale"));
const helper_index_1 = require("../../helpers/helper.index");
const GetOrganizationalSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        payload.pageNumber = payload.pageNumber || 1;
        payload.pageSize = payload.pageSize || 10;
        payload.searchString = payload.searchString || "";
        payload.sortBy = payload.sortBy || "createdAt";
        payload.sortOrder = payload.sortOrder || "desc";
        (0, config_db_1.connectToDB)();
        // Find the user with the provided email
        const user = yield model_user_1.default.findOne({ email: payload.email });
        if (!user)
            return res
                .status(412)
                .json({ message: "User not found", code: "412", data: {} });
        const isSearchingByPeriod = !!(payload.period ||
            (payload.startDate && payload.endDate));
        // Find the organization with the provided unique id
        const organization = yield model_organization_1.default.findOne({
            _id: payload.organizationId,
        });
        if (!organization)
            return res
                .status(412)
                .json({ message: "Organization not found", code: "412", data: {} });
        let start, end;
        const now = new Date();
        // Set date range based on the period
        switch (payload.period) {
            case types_sale_1.SalesPeriod.THIS_WEEK:
                start = new Date(now.setDate(now.getDate() - now.getDay())).setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setDate(end.getDate() + 6);
                break;
            case types_sale_1.SalesPeriod.THIS_MONTH:
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case types_sale_1.SalesPeriod.THIS_YEAR:
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date(now.getFullYear(), 11, 31);
                break;
            case types_sale_1.SalesPeriod.TODAY:
                start = new Date(now.setHours(0, 0, 0, 0));
                end = new Date(now.setHours(23, 59, 59, 999));
                break;
            case types_sale_1.SalesPeriod.YESTERDAY:
                start = new Date(now.setDate(now.getDate() - 1));
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setHours(23, 59, 59, 999);
                break;
            case types_sale_1.SalesPeriod.LAST_7_DAYS:
                start = new Date(now.setDate(now.getDate() - 7));
                end = new Date();
                break;
            case types_sale_1.SalesPeriod.LAST_30_DAYS:
                start = new Date(now.setDate(now.getDate() - 30));
                end = new Date();
                break;
            default:
                if (payload.startDate && payload.endDate) {
                    start = new Date(payload.startDate);
                    end = new Date(payload.endDate);
                }
                break;
        }
        // Calculate the number of orders to skip based on the page number and page size.
        const skipAmount = (payload.pageNumber - 1) * payload.pageSize;
        // Create a case-insensitive regular expression for the provided search string.
        const regex = new RegExp(payload.searchString, "i");
        //calculate sales made for this week
        // Create an initial query object to filter orders.
        const query = {
            organization: organization._id,
            status: payload.status || { $ne: types_sale_1.SaleStatus.CANCELLED },
        };
        // If the period is provided, add the createdAt field to the query.
        if ((start && end) || payload.period) {
            query.createdAt = { $gte: start, $lte: end };
        }
        // If the search string is not empty, add the $or operator to match either name or genericName fields.
        if (payload.searchString.trim() !== "") {
            query.$or = [{ name: { $regex: regex } }];
        }
        // Define the sort options for the fetched orders based on createdAt field and provided sort order.
        const sortOptions = { [payload.sortBy]: payload.sortOrder };
        // Create a query to fetch the orders based on the search and sort criteria.
        const ordersQuery = model_sale_1.default.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(isSearchingByPeriod ? 0 : payload.pageSize)
            .populate("saleItems");
        // Count the total number of orders that match the search criteria (without pagination).
        const totalOrdersCount = yield model_sale_1.default.countDocuments(query);
        const results = yield ordersQuery.exec();
        // Check if there are more orders beyond the current page.
        const isNext = totalOrdersCount > skipAmount + results.length;
        const totalPages = Math.ceil(totalOrdersCount / payload.pageSize);
        //get the total amount of sales
        const totalSalesAmount = results.reduce((sum, sale) => sum + sale.amount, 0);
        return res.status(200).json({
            message: "",
            code: "200",
            data: Object.assign({}, (0, helper_index_1.parseApiResults)({
                results,
                isNext,
                total: totalOrdersCount,
                pageSize: payload.pageSize,
                pageNumber: payload.pageNumber,
                totalPages,
                totalSalesAmount,
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
exports.default = GetOrganizationalSales;
