import express from "express"
import Middleware from "../middlewares/middleware.app"
import CreateProduct from "../controllers/product/controller.create-product"
import FetchAllProducts from "../controllers/product/controller.fetch-all-product"
import FetchOrganizationalProducts from "../controllers/product/controller.fetch-by-organization"
import FetchProductsInStock from "../controllers/product/controller.fetch-products-in-stock"
import FetchProductById from "../controllers/product/controller.fetch-by-id"
import ProductUpdate from "../controllers/product/controller.update-product"
import DeleteProduct from "../controllers/product/controller.delete-product"

const productsRouter = express.Router()

productsRouter.post("/", Middleware, CreateProduct)
productsRouter.get("/get-all", Middleware, FetchAllProducts)
productsRouter.get(
  "/get-by-organization",
  Middleware,
  FetchOrganizationalProducts
)
productsRouter.get("/get-products-in-stock", Middleware, FetchProductsInStock)
productsRouter.get("/get-products-by-id", Middleware, FetchProductById)
productsRouter.patch("/update-product", Middleware, ProductUpdate)
productsRouter.delete("/delete-product", Middleware, DeleteProduct)

export default productsRouter
