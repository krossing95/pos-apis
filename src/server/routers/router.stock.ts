import express from "express"
import Middleware from "../middlewares/middleware.app"
import AddStock from "../controllers/stock/controller.add-stock"
import GetOrganizationalStock from "../controllers/stock/controller.get-organizational-stock"

const stockRouter = express.Router()

stockRouter.post("/add-stock", Middleware, AddStock)
stockRouter.get("/get-organizational-stock", Middleware, GetOrganizationalStock)

export default stockRouter
