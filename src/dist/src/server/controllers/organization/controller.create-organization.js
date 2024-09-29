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
const helper_index_1 = require("../../helpers/helper.index");
const CreateOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        // Find the user with the provided unique id
        const user = yield model_user_1.default.findOne({ _id: payload.createdById });
        if (!user)
            return res
                .status(412)
                .json({ message: "User not found", code: "412", data: {} });
        const newOrganization = new model_organization_1.default({
            name: payload.name,
            description: payload.description,
            logo: payload.logo,
            address: payload.address,
            phone: payload.phone,
            createdBy: payload.createdById, // Use the mongoose ID of the user
        });
        //check if the organization name already exists
        const organizationExists = yield model_organization_1.default.findOne({
            name: newOrganization.name,
        });
        if (organizationExists)
            return res.status(412).json({
                message: "Organization with this name already exists",
                code: "412",
                data: {},
            });
        const createdOrganization = yield newOrganization.save();
        // Update User model
        user.organizations.push(createdOrganization._id);
        yield user.save();
        return res.status(200).json({
            message: "",
            code: "200",
            data: Object.assign({}, (0, helper_index_1.parseApiResults)(createdOrganization)),
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
exports.default = CreateOrganization;
