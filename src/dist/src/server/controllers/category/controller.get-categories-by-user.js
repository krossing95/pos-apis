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
const utils_index_1 = require("../../utils/utils.index");
const helper_index_1 = require("../../helpers/helper.index");
const offsetCalculator = ({ pageNumber = 1, pageSize = 20, searchString = "", sortBy = "desc", userId, }) => {
    // Calculate the number of categories to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;
    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");
    // Create an initial query object to filter categories.
    const query = Object.assign({ createdBy: userId }, utils_index_1.defaultGetQuery);
    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
        query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
    }
    // Define the sort options for the fetched categories based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };
    return {
        skipAmount,
        query,
        sortOptions,
        pageSize,
    };
};
const GetCategoriesByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, config_db_1.connectToDB)();
        const payload = req.body;
        // Find the user by the provided email
        const user = yield model_user_1.default.findOne({ email: payload.email });
        if (!user)
            return res
                .status(412)
                .json({ message: "User not found", code: "412", data: {} });
        const { query, sortOptions, skipAmount, pageSize } = offsetCalculator(Object.assign(Object.assign({}, payload), { userId: user._id }));
        // Create a query to fetch the categories based on the search and sort criteria.
        const organizationsQuery = model_category_1.default.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);
        // Count the total number of categories that match the search criteria (without pagination).
        const totalCategoriesCount = yield model_category_1.default.countDocuments(query);
        const results = yield organizationsQuery.exec();
        // Check if there are more results beyond the current page.
        const isNext = totalCategoriesCount > skipAmount + results.length;
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
exports.default = GetCategoriesByUser;
