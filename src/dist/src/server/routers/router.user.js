"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_app_1 = __importDefault(require("../middlewares/middleware.app"));
const controller_fetch_or_create_1 = __importDefault(require("../controllers/user/controller.fetch-or-create"));
const controller_update_user_1 = __importDefault(require("../controllers/user/controller.update-user"));
const userRouter = express_1.default.Router();
userRouter.post("/fetch-or-create", middleware_app_1.default, controller_fetch_or_create_1.default);
userRouter.patch("/update-user", middleware_app_1.default, controller_update_user_1.default);
exports.default = userRouter;
