"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_app_1 = __importDefault(require("../middlewares/middleware.app"));
const controller_create_product_1 = __importDefault(require("../controllers/product/controller.create-product"));
const controller_fetch_all_product_1 = __importDefault(require("../controllers/product/controller.fetch-all-product"));
const controller_fetch_by_organization_1 = __importDefault(require("../controllers/product/controller.fetch-by-organization"));
const controller_fetch_products_in_stock_1 = __importDefault(require("../controllers/product/controller.fetch-products-in-stock"));
const controller_fetch_by_id_1 = __importDefault(require("../controllers/product/controller.fetch-by-id"));
const controller_update_product_1 = __importDefault(require("../controllers/product/controller.update-product"));
const controller_delete_product_1 = __importDefault(require("../controllers/product/controller.delete-product"));
const productsRouter = express_1.default.Router();
productsRouter.post("/", middleware_app_1.default, controller_create_product_1.default);
productsRouter.get("/get-all", middleware_app_1.default, controller_fetch_all_product_1.default);
productsRouter.get("/get-by-organization", middleware_app_1.default, controller_fetch_by_organization_1.default);
productsRouter.get("/get-products-in-stock", middleware_app_1.default, controller_fetch_products_in_stock_1.default);
productsRouter.get("/get-products-by-id", middleware_app_1.default, controller_fetch_by_id_1.default);
productsRouter.patch("/update-product", middleware_app_1.default, controller_update_product_1.default);
productsRouter.delete("/delete-product", middleware_app_1.default, controller_delete_product_1.default);
exports.default = productsRouter;
