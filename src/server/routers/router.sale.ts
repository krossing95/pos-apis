import express from "express"
import Middleware from "../middlewares/middleware.app"
import CreateSale from "../controllers/sale/controller.create-sale"
import GetSaleById from "../controllers/sale/controller.get-sale-by-id"
import GetOrganizationalSales from "../controllers/sale/controller.get-organizational-sales"
import PayForSale from "../controllers/sale/controller.pay-for-sale"
import DeleteSale from "../controllers/sale/controller.delete-sale"
import GetSaleAnalytics from "../controllers/sale/controller.get-analytics"
import Get10MostSoldProducts from "../controllers/sale/controller.get-most-sold-products"
import GetLeastSoldProducts from "../controllers/sale/controller.least-sold-products"
import DeleteAllSalesAndSaleItems from "../controllers/sale/controller.delete-sales"

const salesRouter = express.Router()

salesRouter.post("/create-sale", Middleware, CreateSale)
salesRouter.get("/get-sale-by-id", Middleware, GetSaleById)
salesRouter.get("/get-organizational-sale", Middleware, GetOrganizationalSales)
salesRouter.get("/pay-for-sale", Middleware, PayForSale)
salesRouter.delete("/delete-sale", Middleware, DeleteSale)
salesRouter.delete("/delete-all-sales", Middleware, DeleteAllSalesAndSaleItems)
salesRouter.get("/get-analytics", Middleware, GetSaleAnalytics)
salesRouter.get("/get-most-sold-products", Middleware, Get10MostSoldProducts)
salesRouter.get("/get-least-sold-products", Middleware, GetLeastSoldProducts)

export default salesRouter
