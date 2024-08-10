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
const helper_index_1 = require("../../helpers/helper.index");
const UpdateOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, config_db_1.connectToDB)();
        const payload = req.body;
        // Find the organization by its _id and update the information
        const updatedOrganization = yield model_organization_1.default.findOneAndUpdate({ _id: payload.organizationId }, {
            name: payload.name,
            description: payload.description,
            phone: payload.phone,
            logo: payload.logo,
            address: payload.address,
        });
        if (!updatedOrganization)
            return res
                .status(412)
                .json({ message: "Organization not found", code: "412", data: {} });
        return res.status(200).json({
            message: "",
            code: "200",
            data: Object.assign({}, (0, helper_index_1.parseApiResults)(updatedOrganization)),
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
exports.default = UpdateOrganization;
