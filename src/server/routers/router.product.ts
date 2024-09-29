import express from "express"
import Middleware from "../middlewares/middleware.app"
import CreateProduct from "../controllers/product/controller.create-product"
import FetchAllProducts from "../controllers/product/controller.fetch-all-product"
import FetchOrganizationalProducts from "../controllers/product/controller.fetch-by-organization"
import FetchProductsInStock from "../controllers/product/controller.fetch-products-in-stock"

const productsRouter = express.Router()

productsRouter.post("/", Middleware, CreateProduct)
productsRouter.get("/get-all", Middleware, FetchAllProducts)
productsRouter.get(
  "/get-by-organization",
  Middleware,
  FetchOrganizationalProducts
)
productsRouter.get("/get-products-in-stock", Middleware, FetchProductsInStock)

export default productsRouter
