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
const helper_index_1 = require("../../helpers/helper.index");
const offsetCalculator = ({ pageNumber = 1, pageSize = 20, sortBy = "desc", searchString = "", }) => {
    // Calculate the number of organizations to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;
    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");
    // Create an initial query object to filter organizations.
    const query = Object.assign({}, utils_index_1.defaultGetQuery);
    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
        query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
    }
    // Define the sort options for the fetched organizations based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };
    return {
        skipAmount,
        pageSize,
        query,
        sortOptions,
        pageNumber,
    };
};
const GetUserOrganizations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, config_db_1.connectToDB)();
        const payload = req.body;
        // Find the user with the provided unique email
        const user = yield model_user_1.default.findOne({ email: payload.email });
        if (!user)
            return res
                .status(412)
                .json({ message: "User not found", code: "412", data: {} });
        const { sortOptions, query, skipAmount, pageSize, pageNumber } = offsetCalculator(Object.assign({}, payload));
        // query the user's organizations by fecthing the organization ids in the user model
        const results = (yield model_organization_1.default.find(Object.assign({ createdBy: user._id.toString() }, utils_index_1.defaultGetQuery))
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize));
        // Count the total number of organizations that match the search criteria (without pagination).
        const totalOrganizationsCount = yield model_organization_1.default.find({
            createdBy: user._id.toString(),
        }).countDocuments(query);
        // Check if there are more organizations beyond the current page.
        const isNext = totalOrganizationsCount > skipAmount + results.length;
        const totalPages = Math.ceil(totalOrganizationsCount / pageSize);
        return res.status(200).json({
            message: "",
            code: "200",
            data: Object.assign({}, (0, helper_index_1.parseApiResults)({
                results,
                isNext,
                total: totalOrganizationsCount,
                pageSize,
                pageNumber,
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
exports.default = GetUserOrganizations;
