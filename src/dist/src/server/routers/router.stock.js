"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_app_1 = __importDefault(require("../middlewares/middleware.app"));
const controller_add_stock_1 = __importDefault(require("../controllers/stock/controller.add-stock"));
const controller_get_organizational_stock_1 = __importDefault(require("../controllers/stock/controller.get-organizational-stock"));
const stockRouter = express_1.default.Router();
stockRouter.post("/add-stock", middleware_app_1.default, controller_add_stock_1.default);
stockRouter.get("/get-organizational-stock", middleware_app_1.default, controller_get_organizational_stock_1.default);
exports.default = stockRouter;
