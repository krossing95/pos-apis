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
const SetActiveOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        (0, config_db_1.connectToDB)();
        const payload = req.body;
        const [user, organization] = yield Promise.all([
            model_user_1.default.findOne({ _id: payload.userId }),
            model_organization_1.default.findOne(Object.assign({ _id: payload.organizationId }, utils_index_1.defaultGetQuery)),
        ]);
        if (!user || !organization)
            return res.status(412).json({
                message: "User or organization not found",
                code: "412",
                data: {},
            });
        //check if the organization is already the active organization
        if (user.activeOrganization &&
            ((_a = user.activeOrganization) === null || _a === void 0 ? void 0 : _a.toString()) === organization._id.toString())
            return res.status(412).json({
                message: "Organization is already the active organization",
                code: "412",
                data: {},
            });
        // Update the user's active organization
        user.activeOrganization = organization._id;
        yield user.save();
        return res.status(200).json({
            message: "",
            code: "200",
            data: Object.assign({}, (0, helper_index_1.parseApiResults)(organization)),
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
exports.default = SetActiveOrganization;
