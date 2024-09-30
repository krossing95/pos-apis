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
const helper_index_1 = require("../../helpers/helper.index");
const FetchOrCreateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        (0, config_db_1.connectToDB)();
        //find user by id and populate communities
        let user;
        const findUser = yield model_user_1.default.findOne({ email: payload.email });
        if (findUser) {
            user = findUser;
        }
        //if user is not found, create a new user
        if (!findUser) {
            const createUser = yield model_user_1.default.create({
                email: payload.email,
                onboarded: false,
                name: payload.name,
                username: (0, helper_index_1.extractNameFromEmail)(payload.email),
                verified: false,
                organizations: [],
            });
            user = createUser;
        }
        return res.status(200).json({ message: "", code: "200", data: { user } });
    }
    catch (error) {
        return res.status(500).json({
            message: "Whoops! Something went wrong",
            code: "500",
            data: {},
        });
    }
});
exports.default = FetchOrCreateUser;
