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
const model_supplier_1 = __importDefault(require("../../models/model.supplier"));
const helper_index_1 = require("../../helpers/helper.index");
const CreateSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        (0, config_db_1.connectToDB)();
        // Find the user with the provided unique id
        const user = yield model_user_1.default.findOne({ _id: payload.createdById });
        if (!user)
            return res
                .status(412)
                .json({ message: "User not found", code: "412", data: {} });
        const newSupplier = new model_supplier_1.default({
            name: payload.name,
            description: payload.description,
            image: payload.image,
            organization: payload.organizationId,
            createdBy: payload.createdById, // Use the mongoose ID of the user
            address: payload.address,
            phone: payload.phone,
            email: payload.email,
        });
        //check if the supplier name already exists
        const supplierExists = yield model_supplier_1.default.findOne({
            name: newSupplier.name,
        });
        if (supplierExists)
            return res.status(412).json({
                message: "Supplier with this name already exists",
                code: "412",
                data: {},
            });
        const createdSupplier = yield newSupplier.save();
        return res.status(201).json({
            message: "Supplier created successfully",
            code: "201",
            data: Object.assign({}, (0, helper_index_1.parseApiResults)(createdSupplier)),
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
exports.default = CreateSupplier;
