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
const model_supplier_1 = __importDefault(require("../../models/model.supplier"));
const utils_index_1 = require("../../utils/utils.index");
const GetAllSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        payload.searchString = payload.searchString || "";
        payload.pageNumber = payload.pageNumber || 1;
        payload.pageSize = payload.pageSize || 20;
        payload.sortBy = payload.sortBy || "desc";
        (0, config_db_1.connectToDB)();
        // Calculate the number of suppliers to skip based on the page number and page size.
        const skipAmount = (payload.pageNumber - 1) * payload.pageSize;
        // Create a case-insensitive regular expression for the provided search string.
        const regex = new RegExp(payload.searchString, "i");
        // Create an initial query object to filter suppliers.
        const query = Object.assign({}, utils_index_1.defaultGetQuery);
        // If the search string is not empty, add the $or operator to match either username or name fields.
        if (payload.searchString.trim() !== "") {
            query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
        }
        // Define the sort options for the fetched suppliers based on createdAt field and provided sort order.
        const sortOptions = { createdAt: payload.sortBy };
        // Create a query to fetch the suppliers based on the search and sort criteria.
        const categoriesQuery = model_supplier_1.default.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(payload.pageSize);
        // Count the total number of suppliers that match the search criteria (without pagination).
        const totalSuppliersCount = yield model_supplier_1.default.countDocuments(query);
        const suppliers = yield categoriesQuery.exec();
        // Check if there are more suppliers beyond the current page.
        const isNext = totalSuppliersCount > skipAmount + suppliers.length;
        return res
            .status(200)
            .json({ message: "", code: "200", data: { suppliers, isNext } });
    }
    catch (error) {
        return res.status(500).json({
            message: "Whoops! Something went wrong",
            code: "500",
            data: {},
        });
    }
});
exports.default = GetAllSuppliers;
