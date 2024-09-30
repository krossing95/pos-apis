import express from "express"
import Middleware from "../middlewares/middleware.app"
import CreateSupplier from "../controllers/suppliers/controller.create-supplier"
import GetAllSuppliers from "../controllers/suppliers/controller.get-all-suppliers"
import GetSuppliersByUser from "../controllers/suppliers/controller.get-suppliers-by-user"
import GetOrganizationalSuppliers from "../controllers/suppliers/controller.get-organizational-suppliers"
import UpdateSupplier from "../controllers/suppliers/controller.update-supplier"
import DeleteSupplier from "../controllers/suppliers/controller.delete-supplier"

const supplierRouter = express.Router()

supplierRouter.post("/create-supplier", Middleware, CreateSupplier)
supplierRouter.get("/get-all-suppliers", Middleware, GetAllSuppliers)
supplierRouter.get("/get-suppliers-by-user", Middleware, GetSuppliersByUser)
supplierRouter.get(
  "/get-suppliers-by-organization",
  Middleware,
  GetOrganizationalSuppliers
)
supplierRouter.patch("/update-supplier", Middleware, UpdateSupplier)
supplierRouter.delete("/delete-supplier", Middleware, DeleteSupplier)

export default supplierRouter
