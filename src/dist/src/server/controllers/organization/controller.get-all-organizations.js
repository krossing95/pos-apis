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
const utils_index_1 = require("../../utils/utils.index");
const model_organization_1 = __importDefault(require("../../models/model.organization"));
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
        pageSize,
        sortOptions,
        query,
        skipAmount,
    };
};
const GetAllOrganizations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const { query, sortOptions, skipAmount, pageSize } = offsetCalculator(Object.assign({}, payload));
        // Create a query to fetch the organizations based on the search and sort criteria.
        const organizationsQuery = model_organization_1.default.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)
            .populate("members");
        // Count the total number of organizations that match the search criteria (without pagination).
        const totalOrganizationsCount = yield model_organization_1.default.countDocuments(query);
        const organizations = yield organizationsQuery.exec();
        // Check if there are more organizations beyond the current page.
        const isNext = totalOrganizationsCount > skipAmount + organizations.length;
        return res
            .status(200)
            .json({ message: "", code: "200", data: { organizations, isNext } });
    }
    catch (error) {
        return res.status(500).json({
            message: "Whoops! Something went wrong",
            code: "500",
            data: {},
        });
    }
});
exports.default = GetAllOrganizations;
